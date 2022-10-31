import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Company } from '../company/company.entity';
import { Permission } from '../permission/permission.entity';

@ObjectType()
@Entity({ name: 'api_key' })
@Unique('uk_api_key_uid', ['uid'])
@Unique('uk_api_key', ['value', 'company'])
export class ApiKey extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @Generated('uuid')
  uid: string;

  @Field()
  @Column({ type: 'varchar', length: 16 })
  value: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  alias?: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // relations

  @Field(() => Company)
  @ManyToOne(() => Company, (company) => company.apiKeys, { nullable: false })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Field(() => [Permission])
  @OneToMany(() => Permission, (permission) => permission.apiKey)
  permissions: Permission[];
}
