import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Membership } from '../membership/membership.entity';
import { ClubEvent } from '../event/event.entity';

@Entity({ name: 'club' })
export class Club {
  @PrimaryGeneratedColumn({ name: 'id_club' })
  idClub: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'email_contact', type: 'varchar', length: 255 })
  emailContact: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 10, nullable: true })
  postalCode: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ name: 'club_status', type: 'varchar', length: 20, default: 'pending' })
  clubStatus: string;

  @Column({ name: 'structure_type', type: 'varchar', length: 20, default: 'club' })
  structureType: string;

  @CreateDateColumn({ name: 'created_at', type: 'date' })
  createdAt: Date;

  @OneToMany(() => Membership, (membership) => membership.club)
  memberships: Membership[];

  @OneToMany(() => ClubEvent, (event) => event.club)
  events: ClubEvent[];
}