import { Controller, Get, Param } from '@nestjs/common';
import { ClubService } from './club.service';

@Controller('clubs')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.clubService.findBySlug(slug);
  }
}