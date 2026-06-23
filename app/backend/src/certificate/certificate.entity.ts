import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { CertificateStatus } from './certificate.enums';

/**
 * Medical fitness certificate for a user. Its FK is the only ON DELETE CASCADE
 * of the schema; `expiration_date` is computed in the service (issue date plus
 * one year minus one day).
 */
@Entity({ name: 'certificates' })
export class Certificate {
  @PrimaryGeneratedColumn({ name: 'id_certificate' })
  idCertificate: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  file: string;

  @CreateDateColumn({ name: 'deposit_at' })
  depositAt: Date;

  @Column({ name: 'issue_date', type: 'date' })
  issueDate: Date;

  @Column({ name: 'expiration_date', type: 'date' })
  expirationDate: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: CertificateStatus,
    default: CertificateStatus.PENDING,
  })
  status: CertificateStatus;
}
