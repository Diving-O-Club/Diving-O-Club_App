import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Membership } from '../membership/membership.entity';

/**
 * Reference table of role codes (member, instructor, committee, admin,
 * super_admin). `code_role` is the stable technical identifier used by the
 * authorization logic; display labels live on the front.
 */
@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn({ name: 'id_role' })
  idRole: number;

  @Column({ name: 'code_role', type: 'varchar', length: 30, unique: true })
  codeRole: string;

  @OneToMany(() => Membership, (membership) => membership.role)
  memberships: Membership[];
}
