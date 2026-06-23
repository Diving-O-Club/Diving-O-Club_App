import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Club } from './club.entity';

/**
 * Club read logic: full club lookup by slug (with members and events) and a
 * lightweight name/city search.
 */
@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private readonly clubRepo: Repository<Club>,
  ) {}

  /** Search clubs by name or city; returns only name, city and slug. */
  async search(query: string) {
    return this.clubRepo.find({
      where: [{ name: ILike(`%${query}%`) }, { city: ILike(`%${query}%`) }],
      select: ['name', 'city', 'slug'],
    });
  }

  /** Load a club by slug with its memberships (users + roles) and its events. */
  async findBySlug(slug: string): Promise<Club> {
    const club = await this.clubRepo.findOne({
      where: { slug },
      relations: [
        'memberships',
        'memberships.user',
        'memberships.role',
        'events',
      ],
    });

    if (!club) {
      throw new NotFoundException(`Club "${slug}" not found`);
    }

    return club;
  }
}
