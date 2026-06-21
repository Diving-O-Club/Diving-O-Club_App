import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClubEvent } from './event.entity';
import { Membership } from '../membership/membership.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { LogService } from '../log/log.service';

const MANAGER_ROLES = ['admin', 'super_admin', 'instructor', 'committee'];

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(ClubEvent)
    private readonly eventRepo: Repository<ClubEvent>,
    @InjectRepository(Membership)
    private readonly membershipRepo: Repository<Membership>,
    private readonly logService: LogService,
  ) {}

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

  async findAllByClub(clubId: number): Promise<object[]> {
    const events = await this.eventRepo.find({
      where: { club: { idClub: clubId } },
      relations: ['creator'],
      order: { startDatetime: 'ASC' },
    });
    return events.map((e) => ({
      ...e,
      creator: e.creator
        ? { firstName: e.creator.firstName, lastName: e.creator.lastName }
        : null,
    }));
  }

  async findById(eventId: number): Promise<object> {
    const event = await this.eventRepo.findOne({
      where: { idEvent: eventId },
      relations: ['creator', 'club'],
    });
    if (!event) throw new NotFoundException('Événement introuvable');
    return {
      ...event,
      creator: event.creator
        ? { firstName: event.creator.firstName, lastName: event.creator.lastName }
        : null,
    };
  }

  async create(
    userId: number,
    clubId: number,
    dto: CreateEventDto,
  ): Promise<ClubEvent> {
    await this.assertManager(userId, clubId);

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
}
