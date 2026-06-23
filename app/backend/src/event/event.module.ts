import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubEvent } from './event.entity';
import { EventRegistration } from './event-registration.entity';
import { Membership } from '../membership/membership.entity';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { LogModule } from '../log/log.module';

/**
 * Event module: club events plus their registrations and waitlist. Imports the
 * membership repository to enforce manager/member authorization.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([ClubEvent, EventRegistration, Membership]),
    LogModule,
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
