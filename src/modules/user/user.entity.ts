import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Company } from '../company/company.entity';
import { VerificationCode } from '../verification-code/verfication-code.entity';
import { AssignedRole } from '../assigned-role/assigned-role.entity';

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

  // relations

  @Field(() => Company)
  @ManyToOne(() => Company, (company) => company.users, { nullable: false })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  // TODO: create the resolvers for this relation
  @Field(() => [VerificationCode])
  @OneToMany(
    () => VerificationCode,
    (verificationCode) => verificationCode.user,
    {
      cascade: ['insert', 'remove'],
    },
  )
  verificationCodes: VerificationCode[];

  @Field(() => [AssignedRole])
  @OneToMany(() => AssignedRole, (assignedRole) => assignedRole.user, {
    cascade: ['insert', 'remove'],
  })
  assignedRoles: AssignedRole[];
}
