import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { ClubEvent } from './event.entity';
import { User } from '../user/user.entity';
import { RegistrationStatus } from './event-registration.enums';

/**
 * A user's registration to an event. Surrogate PK + UNIQUE(id_user, id_event):
 * a user registers only once per event (registered, waitlist or cancelled).
 */
@Entity({ name: 'registrations' })
@Unique(['user', 'event'])
export class EventRegistration {
  @PrimaryGeneratedColumn({ name: 'id_registration' })
  idRegistration: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @ManyToOne(() => ClubEvent, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_event' })
  event: ClubEvent;

  @Column({
    name: 'status',
    type: 'enum',
    enum: RegistrationStatus,
    default: RegistrationStatus.REGISTERED,
  })
  status: string;

  @CreateDateColumn({ name: 'registration_at' })
  createdAt: Date;
}
