import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, OneToMany } from 'typeorm';

import { Company } from '../companies/company.entity';
import { AssignedRole } from '../assigned-roles/assigned-role.entity';

@Entity({ name: 'users' })
@Unique('uk_users_auth_uid', ['authUid'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'auth_uid', type: 'varchar', length: 100 })
  authUid: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ name: 'is_admin', type: 'boolean' })
  isAdmin: boolean;

  @Column({ name: 'email_verified', type: 'boolean', default: false })
  emailVerified: boolean;

  // relations

  @ManyToOne(type => Company, company => company.users)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(type => AssignedRole, assignedRole => assignedRole.user)
  assignedRoles: AssignedRole[];
}