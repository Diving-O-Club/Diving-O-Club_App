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
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

type AuthReq = Request & { user: { idUser: number; email: string } };

@Controller()
@UseGuards(AuthGuard('jwt'))
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('clubs/:clubId/events')
  async findAll(@Param('clubId') clubId: string) {
    return this.eventService.findAllByClub(parseInt(clubId));
  }

  @Post('clubs/:clubId/events')
  async create(
    @Param('clubId') clubId: string,
    @Body() dto: CreateEventDto,
    @Req() req: AuthReq,
  ) {
    return this.eventService.create(req.user.idUser, parseInt(clubId), dto);
  }

  @Put('events/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Req() req: AuthReq,
  ) {
    return this.eventService.update(req.user.idUser, parseInt(id), dto);
  }

  @Delete('events/:id')
  async delete(@Param('id') id: string, @Req() req: AuthReq) {
    await this.eventService.delete(req.user.idUser, parseInt(id));
    return { success: true };
  }
}
