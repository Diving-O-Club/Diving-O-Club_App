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
import { AppUser } from '../app-user/app-user.entity';

// A user can register only once per event (registered or waitlist).
@Entity({ name: 'event_registration' })
@Unique(['event', 'user'])
export class EventRegistration {
  @PrimaryGeneratedColumn({ name: 'id_registration' })
  idRegistration: number;

  @ManyToOne(() => ClubEvent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_event' })
  event: ClubEvent;

  @ManyToOne(() => AppUser, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: AppUser;

  // 'registered' | 'waitlist'
  @Column({ type: 'varchar', length: 20 })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
