import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Company } from '../company/company.entity';

@ObjectType()
@Entity({ name: 'user' })
@Unique('uk_user_auth_uid', ['authUid'])
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: 'auth_uid', type: 'varchar', length: 100 })
  authUid: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 13, nullable: true })
  phone?: string;

  @Column({ name: 'is_super_admin', type: 'boolean', default: false })
  isSuperAdmin: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // relations

  @Field(() => Company)
  @ManyToOne(() => Company, (company) => company.users, { nullable: false })
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
