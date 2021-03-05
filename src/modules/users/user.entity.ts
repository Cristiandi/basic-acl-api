import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, OneToMany, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Company } from '../companies/company.entity';
import { AssignedRole } from '../assigned-roles/assigned-role.entity';

@Entity({ name: 'users' })
@Unique('uk_users_auth_uid', ['authUid'])
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ name: 'auth_uid', type: 'varchar', length: 100 })
  @Index('auth_uid-idx')
  authUid: string;

  @ApiProperty()
  @Index('email-idx')
  @Column({ type: 'varchar', length: 100 })
  email: string;

  @ApiProperty()
  @Column({ name: 'is_admin', type: 'boolean' })
  isAdmin: boolean;

  @ApiProperty()
  @Column({ name: 'email_verified', type: 'boolean', default: false })
  emailVerified: boolean;

  @ApiProperty()
  @Column({ name: 'anonymous', type: 'boolean', default: false })
  anonymous: boolean;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // relations

  @ApiProperty({ type: () => Company })
  @ManyToOne(type => Company, company => company.users)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ApiProperty({ type: () => [AssignedRole] })
  @OneToMany(type => AssignedRole, assignedRole => assignedRole.user)
  assignedRoles: AssignedRole[];
}