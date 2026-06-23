import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ClubEvent } from '../event/event.entity';
import { PaymentStatus } from './payment.enums';

/**
 * A payment tied to a user and an event. Both FKs are RESTRICT (10-year legal
 * accounting retention); `payment_at` is set only once the payment is validated.
 */
@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn({ name: 'id_payment' })
  idPayment: number;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @ManyToOne(() => ClubEvent, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_event' })
  event: ClubEvent;

  @Column({ type: 'varchar', length: 255, unique: true })
  reference: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  amount: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  // Nullable, no default: filled when the payment is actually validated.
  @Column({ name: 'payment_at', type: 'timestamp', nullable: true })
  paymentAt: Date | null;
}
