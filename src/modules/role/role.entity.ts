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
import { AssignedRole } from '../assigned-role/assigned-role.entity';
import { Permission } from '../permission/permission.entity';

@ObjectType()
@Entity({ name: 'role' })
@Unique('uk_role_uid', ['uid'])
@Unique('uk_role', ['code', 'company'])
export class Role extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Generated('uuid')
  @Column()
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

  // relations

  @Field(() => Company)
  @ManyToOne(() => Company, (company) => company.roles, { nullable: false })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Field(() => [AssignedRole])
  @OneToMany(() => AssignedRole, (assignedRole) => assignedRole.role)
  assignedRoles: AssignedRole[];

  @Field(() => [Permission])
  @OneToMany(() => Permission, (permission) => permission.role)
  permissions: Permission[];
}
