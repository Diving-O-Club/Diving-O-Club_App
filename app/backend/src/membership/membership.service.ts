import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './membership.entity';
import { Role } from '../role/role.entity';
import { LogService } from '../log/log.service';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepo: Repository<Membership>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly logService: LogService,
  ) {}

  async findMyMembership(userId: number): Promise<Membership | null> {
    return this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        status: 'active',
      },
      relations: [
        'user',
        'role',
        'club',
        'club.memberships',
        'club.memberships.user',
        'club.memberships.role',
        'club.events',
      ],
    });
  }

  async getStatusForClub(
    userId: number,
    clubId: number,
  ): Promise<{
    status: 'active' | 'pending' | 'pending_other' | 'active_other' | null;
    clubName?: string;
    clubSlug?: string;
  }> {
    // Check this specific club first
    const forThisClub = await this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        club: { idClub: clubId },
        season: '2025-2026',
      },
    });

    if (forThisClub) {
      return { status: forThisClub.status as 'active' | 'pending' };
    }

    // Check active membership on any other club
    const activeElsewhere = await this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        status: 'active',
        season: '2025-2026',
      },
      relations: ['club'],
    });

    if (activeElsewhere) {
      return {
        status: 'active_other',
        clubName: activeElsewhere.club.name,
        clubSlug: activeElsewhere.club.slug,
      };
    }

    // Check pending request on any other club
    const pendingElsewhere = await this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        status: 'pending',
        season: '2025-2026',
      },
      relations: ['club'],
    });

    if (pendingElsewhere) {
      return {
        status: 'pending_other',
        clubName: pendingElsewhere.club.name,
        clubSlug: pendingElsewhere.club.slug,
      };
    }

    return { status: null };
  }
  async requestMembership(
    userId: number,
    clubId: number,
  ): Promise<{ status: string }> {
    // Check no existing membership for this club
    const existingForClub = await this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        club: { idClub: clubId },
        season: '2025-2026',
      },
    });

    if (existingForClub) {
      throw new ConflictException(
        'Une demande existe déjà pour ce club cette saison',
      );
    }

    // Check no pending or active membership on any other club
    const existingElsewhere = await this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        season: '2025-2026',
      },
    });

    if (existingElsewhere) {
      throw new ConflictException(
        'Vous avez déjà un membership actif ou en attente sur un autre club',
      );
    }

    const defaultRole = await this.roleRepo.findOneBy({ codeRole: 'member' });

    await this.membershipRepo.save({
      user: { idUser: userId },
      club: { idClub: clubId },
      role: defaultRole!,
      season: '2025-2026',
      membershipDate: new Date(),
      status: 'pending',
    });
    await this.logService.logMembership({
      action: 'request_created',
      actorId: userId,
      clubId,
    });

    return { status: 'pending' };
  }

  async cancelRequest(userId: number, clubId: number): Promise<void> {
    const membership = await this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        club: { idClub: clubId },
        status: 'pending',
        season: '2025-2026',
      },
    });

    if (!membership) {
      throw new NotFoundException('Aucune demande en attente pour ce club');
    }

    await this.membershipRepo.remove(membership);
    await this.logService.logMembership({
      action: 'request_cancelled',
      actorId: userId,
      clubId,
    });
  }

  async getPendingRequests(clubId: number): Promise<Membership[]> {
    const memberships = await this.membershipRepo.find({
      where: {
        club: { idClub: clubId },
        status: 'pending',
      },
      relations: ['user'],
    });

    return memberships.map((m) => {
      const { passwordHash: _pw, ...safeUser } = m.user;
      return { ...m, user: safeUser };
    }) as Membership[];
  }

  async acceptRequest(
    membershipId: number,
    clubId: number,
  ): Promise<{ success: boolean }> {
    const membership = await this.membershipRepo.findOne({
      where: {
        idMembership: membershipId,
        club: { idClub: clubId },
        status: 'pending',
      },
    });

    if (!membership) {
      throw new NotFoundException('Demande introuvable');
    }

    membership.status = 'active';
    membership.decisionDate = new Date();
    await this.membershipRepo.save(membership);
    await this.logService.logMembership({
      action: 'request_accepted',
      actorId: membership.user?.idUser,
      clubId,
    });

    return { success: true };
  }

  async rejectRequest(membershipId: number, clubId: number): Promise<void> {
    const membership = await this.membershipRepo.findOne({
      where: {
        idMembership: membershipId,
        club: { idClub: clubId },
        status: 'pending',
      },
    });

    if (!membership) {
      throw new NotFoundException('Demande introuvable');
    }

    await this.membershipRepo.remove(membership);
    await this.logService.logMembership({
      action: 'request_rejected',
      actorId: membership.user?.idUser,
      clubId,
    });
  }
}
