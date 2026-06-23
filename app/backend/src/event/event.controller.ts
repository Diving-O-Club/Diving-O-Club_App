import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

type AuthReq = Request & { user: { idUser: number; email: string } };

/**
 * Club events and per-event registrations (with waitlist). Read and register
 * routes are open to any authenticated member; create/update/delete require a
 * manager role (admin, super_admin, instructor or committee) in the club.
 */
@ApiTags('Events')
@ApiCookieAuth()
@Controller()
@UseGuards(AuthGuard('jwt'))
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /** List a club's events with registration figures for the caller. */
  @Get('clubs/:clubId/events')
  @ApiOperation({ summary: "List a club's events" })
  @ApiParam({ name: 'clubId', type: Number })
  @ApiResponse({ status: 200, description: 'Events with registration info.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async findAll(@Param('clubId') clubId: string, @Req() req: AuthReq) {
    return this.eventService.findAllByClub(parseInt(clubId), req.user.idUser);
  }

  /** Get a single event with registration figures for the caller. */
  @Get('events/:id')
  @ApiOperation({ summary: 'Get an event by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Event details.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async findOne(@Param('id') id: string, @Req() req: AuthReq) {
    return this.eventService.findById(parseInt(id), req.user.idUser);
  }

  /** List an event's participants, split into registered and waitlist. */
  @Get('events/:eventId/participants')
  @ApiOperation({ summary: 'List event participants (registered + waitlist)' })
  @ApiParam({ name: 'eventId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Registered and waitlisted participants.',
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async participants(@Param('eventId') eventId: string) {
    return this.eventService.getParticipants(parseInt(eventId));
  }

  /** Register the caller for an event (waitlisted if the event is full). */
  @Post('events/:eventId/register')
  @ApiOperation({ summary: 'Register for an event' })
  @ApiParam({ name: 'eventId', type: Number })
  @ApiResponse({ status: 201, description: 'Registered or waitlisted.' })
  @ApiResponse({
    status: 403,
    description: 'Not an active member of the club.',
  })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({ status: 409, description: 'Already registered.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async register(@Param('eventId') eventId: string, @Req() req: AuthReq) {
    return this.eventService.register(req.user.idUser, parseInt(eventId));
  }

  /** Cancel the caller's registration; promotes the first waitlisted member. */
  @Delete('events/:eventId/register')
  @ApiOperation({ summary: 'Cancel my registration' })
  @ApiParam({ name: 'eventId', type: Number })
  @ApiResponse({ status: 200, description: 'Unregistered.' })
  @ApiResponse({ status: 404, description: 'Not registered for this event.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async unregister(@Param('eventId') eventId: string, @Req() req: AuthReq) {
    return this.eventService.unregister(req.user.idUser, parseInt(eventId));
  }

  /** Create an event in a club (manager only). */
  @Post('clubs/:clubId/events')
  @ApiOperation({ summary: 'Create an event (manager only)' })
  @ApiParam({ name: 'clubId', type: Number })
  @ApiResponse({ status: 201, description: 'Event created.' })
  @ApiResponse({ status: 403, description: 'Caller is not a club manager.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async create(
    @Param('clubId') clubId: string,
    @Body() dto: CreateEventDto,
    @Req() req: AuthReq,
  ) {
    return this.eventService.create(req.user.idUser, parseInt(clubId), dto);
  }

  /** Update an event (manager only). */
  @Put('events/:id')
  @ApiOperation({ summary: 'Update an event (manager only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Event updated.' })
  @ApiResponse({ status: 403, description: 'Caller is not a club manager.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Req() req: AuthReq,
  ) {
    return this.eventService.update(req.user.idUser, parseInt(id), dto);
  }

  /** Delete an event (manager only). */
  @Delete('events/:id')
  @ApiOperation({ summary: 'Delete an event (manager only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Event deleted.' })
  @ApiResponse({ status: 403, description: 'Caller is not a club manager.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  @ApiResponse({ status: 401, description: 'Missing or invalid token.' })
  async delete(@Param('id') id: string, @Req() req: AuthReq) {
    await this.eventService.delete(req.user.idUser, parseInt(id));
    return { success: true };
  }
}
