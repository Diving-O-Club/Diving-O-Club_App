import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Membership } from '../membership/membership.entity';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn({ name: 'id_role' })
  idRole: number;

  @Column({ name: 'code_role', type: 'varchar', length: 30, unique: true })
  codeRole: string;

  @Column({ name: 'label_role', type: 'varchar', length: 100 })
  labelRole: string;

  @OneToMany(() => Membership, (membership) => membership.role)
  memberships: Membership[];
}