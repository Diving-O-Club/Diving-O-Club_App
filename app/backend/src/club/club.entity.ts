import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Membership } from '../membership/membership.entity';
import { ClubEvent } from '../event/event.entity';
import { ClubStatus, StructureType } from './club.enums';

/**
 * A diving club (tenant). `slug` is the public URL identifier; `status` is the
 * business soft delete (a club is never physically removed).
 */
@Entity({ name: 'clubs' })
export class Club {
  @PrimaryGeneratedColumn({ name: 'id_club' })
  idClub: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'email_contact', type: 'varchar', length: 255 })
  emailContact: string;

  @Column({ name: 'street', type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @Column({ name: 'postal_code', type: 'varchar', length: 10, nullable: true })
  postalCode: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({
    name: 'structure_type',
    type: 'enum',
    enum: StructureType,
    default: StructureType.CLUB,
  })
  structureType: string;

  // Business soft delete of the club; mapped to DB column "status".
  @Column({
    name: 'status',
    type: 'enum',
    enum: ClubStatus,
    default: ClubStatus.PENDING,
  })
  clubStatus: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Membership, (membership) => membership.club)
  memberships: Membership[];

  @OneToMany(() => ClubEvent, (event) => event.club)
  events: ClubEvent[];
}
