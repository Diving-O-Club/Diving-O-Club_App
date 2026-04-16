import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './membership.entity';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepo: Repository<Membership>,
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
}