import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';

class FirebaseAdminConfig {
  @IsString()
  @Field(() => String)
  readonly type: string;

  @IsString()
  @Field(() => String)
  readonly project_id: string;

  @IsString()
  @Field(() => String)
  readonly private_key_id: string;

  @IsString()
  @Field(() => String)
  readonly private_key: string;

  @IsString()
  @Field(() => String)
  readonly client_email: string;

  @IsString()
  @Field(() => String)
  readonly client_id: string;

  @IsString()
  @Field(() => String)
  readonly auth_uri: string;

  @IsString()
  @Field(() => String)
  readonly token_uri: string;

  @IsString()
  @Field(() => String)
  readonly auth_provider_x509_cert_url: string;

  @IsString()
  @Field(() => String)
  readonly client_x509_cert_url: string;

  @IsOptional()
  @IsString()
  @Field(() => String)
  readonly universe_domain?: string;
}

class FirebaseConfig {
  @IsString()
  @Field(() => String)
  readonly apiKey: string;

  @IsString()
  @Field(() => String)
  readonly authDomain: string;

  @IsString()
  @Field(() => String)
  readonly projectId: string;

  @IsString()
  @Field(() => String)
  readonly storageBucket: string;

  @IsString()
  @Field(() => String)
  readonly messagingSenderId: string;

  @IsString()
  @Field(() => String)
  readonly appId: string;

  @IsString()
  @Field(() => String)
  readonly measurementId: string;

  @IsOptional()
  @IsString()
  @Field(() => String)
  readonly databaseURL?: string;
}

@InputType()
export class CreateCompanyInput {
  @IsString()
  @Field(() => String)
  readonly name: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => FirebaseAdminConfig)
  @Field(() => GraphQLJSONObject)
  readonly firebaseAdminConfig: FirebaseAdminConfig;

  @IsDefined()
  @ValidateNested()
  @Type(() => FirebaseConfig)
  @Field(() => GraphQLJSONObject)
  readonly firebaseConfig: FirebaseConfig;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly website?: string;
}
