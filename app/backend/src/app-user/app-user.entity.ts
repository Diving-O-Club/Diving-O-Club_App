import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Membership } from '../membership/membership.entity';
import { ClubEvent } from '../event/event.entity';
import { DivingLevel, InstructorLevel } from './app-user.enums';

@Entity({ name: 'app_user' })
export class AppUser {
  @PrimaryGeneratedColumn({ name: 'id_user' })
  idUser: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @Column({
    name: 'ffessm_license_number',
    type: 'varchar',
    length: 12,
    unique: true,
    nullable: true,
  })
  ffessmLicenseNumber: string | null;

  @Column({
    name: 'diving_level',
    type: 'enum',
    enum: DivingLevel,
    nullable: true,
  })
  divingLevel: DivingLevel | null;

  @Column({
    name: 'instructor_level',
    type: 'enum',
    enum: InstructorLevel,
    nullable: true,
  })
  instructorLevel: InstructorLevel | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({
    name: 'profile_picture_url',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  profilePictureUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Membership, (membership) => membership.user)
  memberships: Membership[];

  @OneToMany(() => ClubEvent, (event) => event.creator)
  createdEvents: ClubEvent[];
}