import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';
import { Role } from '../roles/role.entity';
import { ApiKey } from '../api-keys/api-key.entity';
import { ConfirmationEmailConfig } from '../confirmation-email-configs/confirmation-email-config.entity';
import { ForgottenPasswordConfig } from '../forgotten-password-configs/forgotten-password-config.entity';

@Entity({ name: 'companies' })
@Unique('uk_companies_name', ['name'])
@Unique('uk_companies_uuid', ['uuid'])
export class Company {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  uuid: string;

  @ApiProperty()
  @Column({ name: 'country_code', type: 'varchar', length: 5 })
  countryCode: string;  

  @ApiProperty()
  @Column({ name: 'service_account', type: 'json' })
  serviceAccount: string;

  @ApiProperty()
  @Column({ name: 'firebase_config', type: 'json' })
  firebaseConfig: string;

  @ApiProperty()
  @Column({ name: 'cofirmation_email_config', type: 'boolean', default: false })
  confirmationEmailConfig: boolean;

  @ApiProperty()
  @Column({ name: 'forgotten_password_config', type: 'boolean', default: false })
  forgottenPasswordConfig: boolean;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // relations
  @ApiProperty({ type: () => [User] })
  @OneToMany(type => User, user => user.company)
  users: User[];

  @ApiProperty({ type: () => [Project] })
  @OneToMany(type => Project, project => project.company)
  projects: Project[];

  @ApiProperty({ type: () => [Role] })
  @OneToMany(type => Role, role => role.company)
  roles: Role[]

  @ApiProperty({ type: () => [ApiKey] })
  @OneToMany(type => ApiKey, apiKey => apiKey.company)
  apiKeys: ApiKey[];

  @ApiProperty({ type: () => [ConfirmationEmailConfig] })
  @OneToMany(type => ConfirmationEmailConfig, confirmationEmailConfig => confirmationEmailConfig.company)
  confirmationEmailConfigs: ConfirmationEmailConfig[];

  @ApiProperty({ type: () => [ForgottenPasswordConfig] })
  @OneToMany(type => ForgottenPasswordConfig, forgottenPasswordConfig => forgottenPasswordConfig.company)
  forgottenPasswordConfigs: ForgottenPasswordConfig[];
}