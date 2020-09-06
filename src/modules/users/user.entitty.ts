import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Company } from '../companies/company.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'auth_uid', type: 'varchar', length: 100 })
  authUid: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ name: 'is_admin', type: 'boolean' })
  isAdmin: string;

  @ManyToOne(type => Company, company => company.users)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}