import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Club } from '../club/club.entity';
import { AppUser } from '../app-user/app-user.entity';

@Entity({ name: 'event' })
export class ClubEvent {
  @PrimaryGeneratedColumn({ name: 'id_event' })
  idEvent: number;

  @ManyToOne(() => Club, (club) => club.events)
  @JoinColumn({ name: 'id_club' })
  club: Club;

  @ManyToOne(() => AppUser, (user) => user.createdEvents)
  @JoinColumn({ name: 'id_creator' })
  creator: AppUser;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'event_type', type: 'varchar', length: 50 })
  eventType: string;

  @Column({ name: 'start_datetime', type: 'timestamp' })
  startDatetime: Date;

  @Column({ name: 'end_datetime', type: 'timestamp' })
  endDatetime: Date;

  @Column({ type: 'varchar', length: 150, nullable: true })
  location: string;

  @Column({ name: 'minimum_level', type: 'varchar', length: 50, nullable: true })
  minimumLevel: string;

  @Column({ name: 'max_capacity', type: 'int', nullable: true })
  maxCapacity: number;

  @Column({ name: 'is_paid', type: 'boolean', default: false })
  isPaid: boolean;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @Column({ name: 'cancel_reason', type: 'text', nullable: true })
  cancelReason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}