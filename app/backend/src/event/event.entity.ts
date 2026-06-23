import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Club } from '../club/club.entity';
import { User } from '../user/user.entity';
import { EventStatus, EventType, MinimumLevel } from './event.enums';

/**
 * A club event (dive trip, training, meeting…) with optional capacity, pricing
 * and a minimum required level. `status` is the business soft delete.
 */
@Entity({ name: 'events' })
export class ClubEvent {
  @PrimaryGeneratedColumn({ name: 'id_event' })
  idEvent: number;

  @ManyToOne(() => Club, (club) => club.events, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_club' })
  club: Club;

  @ManyToOne(() => User, (user) => user.createdEvents, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_creator' })
  creator: User;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    name: 'event_type',
    type: 'enum',
    enum: EventType,
    default: EventType.OTHER,
  })
  eventType: string;

  // Mapped to DB column "start_at" (property kept as "startDatetime").
  @Column({ name: 'start_at', type: 'timestamp' })
  startDatetime: Date;

  // Mapped to DB column "end_at" (property kept as "endDatetime"), nullable.
  @Column({ name: 'end_at', type: 'timestamp', nullable: true })
  endDatetime: Date | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  location: string | null;

  @Column({
    name: 'minimum_level',
    type: 'enum',
    enum: MinimumLevel,
    default: MinimumLevel.ALL,
  })
  minimumLevel: string;

  @Column({ name: 'max_capacity', type: 'int', nullable: true })
  maxCapacity: number | null;

  @Column({ name: 'is_paid', type: 'boolean', default: false })
  isPaid: boolean;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  price: number | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.ACTIVE,
  })
  status: string;

  @Column({ name: 'cancel_reason', type: 'text', nullable: true })
  cancelReason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
