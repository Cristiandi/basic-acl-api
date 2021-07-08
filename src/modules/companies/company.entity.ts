import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

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
@Entity({ name: 'companies' })
@Unique('uk_companies_uid', ['uid'])
@Unique('uk_companies_access_key', ['accessKey'])
@Unique('uk_companies_name', ['name'])
export class Company {
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
  @Column({ name: 'access_key', type: 'varchar', length: 100 })
  accessKey: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column({ name: 'firebase_admin_config', type: 'json' })
  firebaseAdminConfig: FirebaseAdminConfig;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column({ name: 'firebase_config', type: 'json' })
  firebaseConfig: FirebaseConfig;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
