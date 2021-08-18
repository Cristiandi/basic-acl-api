import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Company } from '../company/company.entity';

@ObjectType()
@Entity({ name: 'role' })
@Unique('uk_role_uid', ['uid'])
@Unique('uk_role', ['code', 'company'])
export class Role extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @Generated('uuid')
  uid: string;

  @Field()
  @Column({ type: 'varchar', length: 5 })
  code: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 160, nullable: true })
  description: string;

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
  @ManyToOne(() => Company, (company) => company.roles, { nullable: false })
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
