import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { User } from '../users/user.entitty';
import { Project } from '../projects/project.entity';
import { Role } from '../roles/role.entity';
import { ApiKey } from '../api-keys/api-key.entity';

@Entity({ name: 'companies' })
@Unique('uk_companies_name', ['name'])
@Unique('uk_companies_uuid', ['uuid'])
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'uuid' })
  uuid: string;

  @Column({ name: 'country_code', type: 'varchar', length: 5 })
  countryCode: string;  

  @Column({ name: 'service_account', type: 'json' })
  serviceAccount: string;

  @Column({ name: 'firebase_config', type: 'json' })
  firebaseConfig: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // relations
  @OneToMany(type => User, user => user.company)
  users: User[];

  @OneToMany(type => Project, project => project.company)
  projects: Project[];

  @OneToMany(type => Role, role => role.company)
  roles: Role[]

  @OneToMany(type => ApiKey, apiKey => apiKey.company)
  apiKeys: ApiKey[];
}