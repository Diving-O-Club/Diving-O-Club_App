import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubEvent } from './event.entity';
import { EventRegistration } from './event-registration.entity';
import { Membership } from '../membership/membership.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { LogService } from '../log/log.service';

const MANAGER_ROLES = ['admin', 'super_admin', 'instructor', 'committee'];
const REGISTERED = 'registered';
const WAITLIST = 'waitlist';

/**
 * Event domain logic: CRUD on club events (manager only) and per-event
 * registration with a FIFO waitlist. Capacity is enforced server-side; a null
 * max capacity means unlimited (no waitlist). Audit events are recorded via
 * {@link LogService}.
 */
@Injectable()
export class EventService {
  constructor(
    @InjectRepository(ClubEvent)
    private readonly eventRepo: Repository<ClubEvent>,
    @InjectRepository(EventRegistration)
    private readonly registrationRepo: Repository<EventRegistration>,
    @InjectRepository(Membership)
    private readonly membershipRepo: Repository<Membership>,
    private readonly logService: LogService,
  ) {}

  /** Ensure the user has a manager role (admin/instructor/committee) in the club. */
  private async assertManager(
    userId: number,
    clubId: number,
  ): Promise<Membership> {
    const membership = await this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        club: { idClub: clubId },
        status: 'active',
      },
      relations: ['role', 'club'],
    });

    if (!membership || !MANAGER_ROLES.includes(membership.role.codeRole)) {
      throw new ForbiddenException(
        'Accès réservé aux moniteurs et administrateurs de ce club',
      );
    }

    return membership;
  }

  // remainingSpots is null for unlimited capacity (maxCapacity null).
  private remainingSpots(
    maxCapacity: number | null,
    registeredCount: number,
  ): number | null {
    if (maxCapacity == null) return null;
    return Math.max(0, maxCapacity - registeredCount);
  }

  // Registration figures for one event, from the current user's point of view.
  private async registrationInfo(
    eventId: number,
    maxCapacity: number | null,
    userId: number,
  ): Promise<{
    registeredCount: number;
    remainingSpots: number | null;
    userStatus: string | null;
  }> {
    const registeredCount = await this.registrationRepo.count({
      where: { event: { idEvent: eventId }, status: REGISTERED },
    });
    const myRegistration = await this.registrationRepo.findOne({
      where: { event: { idEvent: eventId }, user: { idUser: userId } },
    });
    return {
      registeredCount,
      remainingSpots: this.remainingSpots(maxCapacity, registeredCount),
      userStatus: myRegistration ? myRegistration.status : null,
    };
  }

  /** List a club's events, each enriched with the caller's registration figures. */
  async findAllByClub(clubId: number, userId: number): Promise<object[]> {
    const events = await this.eventRepo.find({
      where: { club: { idClub: clubId } },
      relations: ['creator'],
      order: { startDatetime: 'ASC' },
    });
    return Promise.all(
      events.map(async (e) => ({
        ...e,
        creator: e.creator
          ? { firstName: e.creator.firstName, lastName: e.creator.lastName }
          : null,
        ...(await this.registrationInfo(e.idEvent, e.maxCapacity, userId)),
      })),
    );
  }

  /** Return one event enriched with the caller's registration figures. */
  async findById(eventId: number, userId: number): Promise<object> {
    const event = await this.eventRepo.findOne({
      where: { idEvent: eventId },
      relations: ['creator', 'club'],
    });
    if (!event) throw new NotFoundException('Événement introuvable');
    return {
      ...event,
      creator: event.creator
        ? {
            firstName: event.creator.firstName,
            lastName: event.creator.lastName,
          }
        : null,
      ...(await this.registrationInfo(eventId, event.maxCapacity, userId)),
    };
  }

  /** Create an event in the club (manager only). */
  async create(
    userId: number,
    clubId: number,
    dto: CreateEventDto,
  ): Promise<ClubEvent> {
    await this.assertManager(userId, clubId);

    // minimum_level is a non-null ENUM: an empty string (sent when no minimum
    // is selected) must fall back to 'all'.
    if (dto.minimumLevel === '') dto.minimumLevel = 'all';

    const event = this.eventRepo.create({
      ...dto,
      club: { idClub: clubId },
      creator: { idUser: userId },
      startDatetime: new Date(dto.startDatetime),
      endDatetime: new Date(dto.endDatetime),
    });

    const saved = await this.eventRepo.save(event);

    await this.logService.logMembership({
      action: 'event_created',
      actorId: userId,
      clubId,
    });

    return saved;
  }

  /** Update an event (manager only). */
  async update(
    userId: number,
    eventId: number,
    dto: UpdateEventDto,
  ): Promise<ClubEvent> {
    const event = await this.eventRepo.findOne({
      where: { idEvent: eventId },
      relations: ['club'],
    });

    if (!event) throw new NotFoundException('Événement introuvable');

    await this.assertManager(userId, event.club.idClub);

    if (dto.minimumLevel === '') dto.minimumLevel = 'all';

    Object.assign(event, {
      ...dto,
      ...(dto.startDatetime && { startDatetime: new Date(dto.startDatetime) }),
      ...(dto.endDatetime && { endDatetime: new Date(dto.endDatetime) }),
    });

    const saved = await this.eventRepo.save(event);

    await this.logService.logMembership({
      action: 'event_updated',
      actorId: userId,
      clubId: event.club.idClub,
    });

    return saved;
  }

  /** Delete an event (manager only). */
  async delete(userId: number, eventId: number): Promise<void> {
    const event = await this.eventRepo.findOne({
      where: { idEvent: eventId },
      relations: ['club'],
    });

    if (!event) throw new NotFoundException('Événement introuvable');

    await this.assertManager(userId, event.club.idClub);

    await this.eventRepo.remove(event);

    await this.logService.logMembership({
      action: 'event_deleted',
      actorId: userId,
      clubId: event.club.idClub,
    });
  }

  // Only an active member of the event's club may register.
  private async assertActiveMember(
    userId: number,
    clubId: number,
  ): Promise<void> {
    const membership = await this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        club: { idClub: clubId },
        status: 'active',
      },
    });
    if (!membership) {
      throw new ForbiddenException('Réservé aux membres de ce club');
    }
  }

  /** Register a member for an event, or place them on the waitlist if full. */
  async register(
    userId: number,
    eventId: number,
  ): Promise<{ status: string; message: string }> {
    const event = await this.eventRepo.findOne({
      where: { idEvent: eventId },
      relations: ['club'],
    });
    if (!event) throw new NotFoundException('Événement introuvable');

    await this.assertActiveMember(userId, event.club.idClub);

    const existing = await this.registrationRepo.findOne({
      where: { event: { idEvent: eventId }, user: { idUser: userId } },
    });
    if (existing) {
      throw new ConflictException('Vous êtes déjà inscrit à cet événement');
    }

    // Unlimited capacity (maxCapacity null) never goes to the waitlist.
    let status = REGISTERED;
    if (event.maxCapacity != null) {
      const registeredCount = await this.registrationRepo.count({
        where: { event: { idEvent: eventId }, status: REGISTERED },
      });
      if (registeredCount >= event.maxCapacity) status = WAITLIST;
    }

    await this.registrationRepo.save({
      event: { idEvent: eventId },
      user: { idUser: userId },
      status,
    });

    await this.logService.logMembership({
      action: status === REGISTERED ? 'event_registered' : 'event_waitlisted',
      actorId: userId,
      clubId: event.club.idClub,
    });

    return {
      status,
      message:
        status === REGISTERED
          ? 'Inscription réussie'
          : 'Événement complet : vous êtes en liste d’attente',
    };
  }

  /**
   * Cancel a registration; when a confirmed spot frees up, promote the first
   * waitlisted member (FIFO).
   */
  async unregister(
    userId: number,
    eventId: number,
  ): Promise<{ success: boolean; message: string }> {
    const registration = await this.registrationRepo.findOne({
      where: { event: { idEvent: eventId }, user: { idUser: userId } },
      relations: ['event', 'event.club'],
    });
    if (!registration) {
      throw new NotFoundException("Vous n'êtes pas inscrit à cet événement");
    }

    const freedSpot = registration.status === REGISTERED;
    const clubId = registration.event.club.idClub;
    await this.registrationRepo.remove(registration);

    // Promote the first waitlisted member when a registered spot frees up.
    if (freedSpot) {
      const nextInLine = await this.registrationRepo.findOne({
        where: { event: { idEvent: eventId }, status: WAITLIST },
        order: { createdAt: 'ASC' },
      });
      if (nextInLine) {
        nextInLine.status = REGISTERED;
        await this.registrationRepo.save(nextInLine);
      }
    }

    await this.logService.logMembership({
      action: 'event_unregistered',
      actorId: userId,
      clubId,
    });

    return { success: true, message: 'Désinscription réussie' };
  }

  /** Return an event's participants split into registered and waitlist (FIFO). */
  async getParticipants(eventId: number): Promise<{
    registered: { firstName: string; lastName: string }[];
    waitlist: { firstName: string; lastName: string }[];
  }> {
    const event = await this.eventRepo.findOne({
      where: { idEvent: eventId },
    });
    if (!event) throw new NotFoundException('Événement introuvable');

    const registrations = await this.registrationRepo.find({
      where: { event: { idEvent: eventId } },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });

    const toName = (r: EventRegistration) => ({
      firstName: r.user.firstName,
      lastName: r.user.lastName,
    });

    return {
      registered: registrations
        .filter((r) => r.status === REGISTERED)
        .map(toName),
      waitlist: registrations.filter((r) => r.status === WAITLIST).map(toName),
    };
  }
}
