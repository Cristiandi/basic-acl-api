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

import { User } from '../user/user.entity';

export enum VerificationCodeType {
  CONFIRM_EMAIL = 'CONFIRM_EMAIL',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

@ObjectType()
@Entity({ name: 'verification_code' })
@Unique('uk_verification_code_uid', ['uid'])
export class VerificationCode extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Generated('uuid')
  @Column()
  uid: string;

  @Field()
  @Column({
    type: 'enum',
    enum: VerificationCodeType,
    default: VerificationCodeType.CONFIRM_EMAIL,
  })
  type: VerificationCodeType;

  @Field()
  @Column({ type: 'varchar', length: 20 })
  code: string;

  @Column({ name: 'expiration_date', type: 'timestamp' })
  expirationDate: Date;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // relations

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.verificationCodes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
