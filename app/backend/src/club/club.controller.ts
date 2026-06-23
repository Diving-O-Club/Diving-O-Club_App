import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ClubService } from './club.service';

/**
 * Public club endpoints: look up a club by its slug, and search clubs by name
 * or city. No authentication required.
 */
@ApiTags('Clubs')
@Controller('clubs')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  /** Get a club (with members and events) by its URL slug. */
  @Get(':slug')
  @ApiOperation({ summary: 'Get a club by slug' })
  @ApiParam({ name: 'slug', type: String })
  @ApiResponse({ status: 200, description: 'Club details.' })
  @ApiResponse({ status: 404, description: 'Club not found.' })
  findBySlug(@Param('slug') slug: string) {
    return this.clubService.findBySlug(slug);
  }

  /** Search clubs by name or city (an empty query returns all). */
  @Get()
  @ApiOperation({ summary: 'Search clubs by name or city' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Matching clubs (name, city, slug).',
  })
  search(@Query('search') search: string) {
    return this.clubService.search(search ?? '');
  }
}
