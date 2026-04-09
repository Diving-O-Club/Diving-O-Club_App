import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Club } from './club.entity';


@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private readonly clubRepo: Repository<Club>,
  ) {}

  async search(query: string) {
    return this.clubRepo.find({
      where: { name: ILike(`%${query}%`) },
      select: ['idClub', 'name', 'city', 'slug'],
    });
  }

  async findBySlug(slug: string): Promise<Club> {
    const club = await this.clubRepo.findOne({
      where: { slug },
      relations: ['memberships', 'memberships.user', 'memberships.role', 'events'],
    });

    if (!club) {
      throw new NotFoundException(`Club "${slug}" not found`);
    }

    return club;
  }
}