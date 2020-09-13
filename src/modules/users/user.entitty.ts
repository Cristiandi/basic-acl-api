import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';

import { Company } from '../companies/company.entity';

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

  // relations

  @ManyToOne(type => Company, company => company.users)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}