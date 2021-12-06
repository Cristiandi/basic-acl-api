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

export enum TemplateType {
  WELCOME_EMAIL = 'WELCOME_EMAIL',
  CONFIRMATION_EMAIL = 'CONFIRMATION_EMAIL',
  RESET_PASSWORD_EMAIL = 'RESET_PASSWORD_EMAIL',
  PASSWORD_UPDATED_EMAIL = 'PASSWORD_UPDATED_EMAIL',
  SUPER_ADMIN_CONFIRMATION_EMAIL = 'SUPER_ADMIN_CONFIRMATION_EMAIL',
}

@ObjectType()
@Entity({ name: 'email_template' })
@Unique('uk_email_template_uid', ['uid'])
@Unique('uk_email_template', ['type', 'company'])
export class EmailTemplate extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @Generated('uuid')
  uid: string;

  @Field()
  @Column({
    type: 'enum',
    enum: TemplateType,
    default: TemplateType.WELCOME_EMAIL,
  })
  type: TemplateType;

  @Column({
    type: 'bytea',
    nullable: true,
  })
  file: Buffer;

  @Field()
  @Column({ type: 'varchar', length: 160, nullable: true })
  subject: string;

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
  @ManyToOne(() => Company, (company) => company.apiKeys)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
