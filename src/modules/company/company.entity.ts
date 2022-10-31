import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../role/role.entity';
import { ApiKey } from '../api-key/api-key.entity';
import { User } from '../user/user.entity';

import { loggerMiddleware } from '../../common/middlewares/logger.middleware';
class FirebaseAdminConfig {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

class FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
  databaseURL?: string;
}

@ObjectType()
@Entity({ name: 'company' })
@Unique('uk_company_uid', ['uid'])
@Unique('uk_company_access_key', ['accessKey'])
@Unique('uk_company_name', ['name'])
export class Company extends BaseEntity {
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

  @Field({ nullable: true, middleware: [loggerMiddleware] })
  @Column({ name: 'access_key', type: 'varchar', length: 100 })
  accessKey: string;

  @Field({ middleware: [loggerMiddleware] })
  @Field(() => GraphQLJSONObject, {
    nullable: true,
    middleware: [loggerMiddleware],
  })
  @Column({ name: 'firebase_admin_config', type: 'json' })
  firebaseAdminConfig: FirebaseAdminConfig;

  @Field(() => GraphQLJSONObject, {
    nullable: true,
    middleware: [loggerMiddleware],
  })
  @Column({ name: 'firebase_config', type: 'json' })
  firebaseConfig: FirebaseConfig;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 160, nullable: true })
  website: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // relations

  @Field(() => [Role])
  @OneToMany(() => Role, (role) => role.company)
  roles: Role[];

  @Field(() => [ApiKey])
  @OneToMany(() => ApiKey, (apiKey) => apiKey.company)
  apiKeys: ApiKey[];

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
