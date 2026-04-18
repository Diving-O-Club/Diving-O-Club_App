import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './membership.entity';
import { Role } from '../role/role.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepo: Repository<Membership>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
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
  ): Promise<{ status: 'active' | 'pending' | 'pending_other' | null; clubName?: string; clubSlug?: string }> {
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
        clubSlug: pendingElsewhere.club.slug
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
      throw new ConflictException('Une demande existe déjà pour ce club cette saison');
    }

    // Check no pending request on any other club
    const pendingElsewhere = await this.membershipRepo.findOne({
      where: {
        user: { idUser: userId },
        status: 'pending',
        season: '2025-2026',
      },
    });

    if (pendingElsewhere) {
      throw new ConflictException('Vous avez déjà une demande en attente sur un autre club');
    }

    const defaultRole = await this.roleRepo.findOneBy({ codeRole: 'member' });

    await this.membershipRepo.save({
      user:           { idUser: userId },
      club:           { idClub: clubId },
      role:           defaultRole!,
      season:         '2025-2026',
      membershipDate: new Date(),
      status:         'pending',
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
  }
}