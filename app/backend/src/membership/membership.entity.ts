import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Club } from '../club/club.entity';
import { Role } from '../role/role.entity';
import { MembershipStatus } from './membership.enums';

@Entity({ name: 'memberships' })
@Unique(['user', 'club', 'season'])
export class Membership {
  @PrimaryGeneratedColumn({ name: 'id_membership' })
  idMembership: number;

  @ManyToOne(() => User, (user) => user.memberships, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @ManyToOne(() => Club, (club) => club.memberships, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_club' })
  club: Club;

  @ManyToOne(() => Role, (role) => role.memberships, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_role' })
  role: Role;

  @Column({ type: 'varchar', length: 9 })
  season: string;

  @Column({
    name: 'membership_at',
    type: 'timestamp',
    default: () => 'NOW()',
  })
  membershipDate: Date;

  @Column({ name: 'decision_at', type: 'timestamp', nullable: true })
  decisionDate: Date | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: MembershipStatus,
    default: MembershipStatus.PENDING,
  })
  status: string;
}
