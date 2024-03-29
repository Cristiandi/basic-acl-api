import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';

@ObjectType()
@Entity({ name: 'assigned_role' })
@Unique('uk_assigned_role', ['role', 'user'])
export class AssignedRole extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // relations

  @Field(() => Role)
  @ManyToOne(() => Role, (role) => role.assignedRoles, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.assignedRoles, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
