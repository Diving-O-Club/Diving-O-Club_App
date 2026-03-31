import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { AppUser } from '../app-user/app-user.entity';
import { Club } from '../club/club.entity';
import { Role } from '../role/role.entity';

@Entity({ name: 'membership' })
@Unique(['user', 'club', 'season'])
export class Membership {
  @PrimaryGeneratedColumn({ name: 'id_membership' })
  idMembership: number;

  @ManyToOne(() => AppUser, (user) => user.memberships)
  @JoinColumn({ name: 'id_user' })
  user: AppUser;

  @ManyToOne(() => Club, (club) => club.memberships)
  @JoinColumn({ name: 'id_club' })
  club: Club;

  @ManyToOne(() => Role, (role) => role.memberships)
  @JoinColumn({ name: 'id_role' })
  role: Role;

  @Column({ type: 'varchar', length: 9 })
  season: string;

  @Column({ name: 'membership_date', type: 'date', default: () => 'CURRENT_DATE' })
  membershipDate: Date;

  @Column({ name: 'decision_date', type: 'date', nullable: true })
  decisionDate: Date;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;
}