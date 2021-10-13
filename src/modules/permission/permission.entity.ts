import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../role/role.entity';
import { ApiKey } from '../api-key/api-key.entity';

@ObjectType()
@Entity({ name: 'permission' })
@Unique('uk_permission', ['role', 'apiKey', 'name'])
export class Permission extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @Generated('uuid')
  uid: string;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Field()
  @Column({ type: 'boolean', default: true })
  allowed: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // relations

  @Field(() => Role, { nullable: true })
  @ManyToOne(() => Role, (role) => role.permissions, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Field(() => ApiKey, { nullable: true })
  @ManyToOne(() => ApiKey, (apiKey) => apiKey.permissions, { nullable: true })
  @JoinColumn({ name: 'api_key_id' })
  apiKey: ApiKey;
}
