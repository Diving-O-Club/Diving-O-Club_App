import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Membership } from '../membership/membership.entity';
import { ClubEvent } from '../event/event.entity';

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

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({
    name: 'ffessm_license_number',
    type: 'varchar',
    length: 30,
    unique: true,
    nullable: true,
  })
  ffessmLicenseNumber: string;

  @Column({
    name: 'technical_level',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  technicalLevel: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

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