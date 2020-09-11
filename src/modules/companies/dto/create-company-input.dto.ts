import { IsString, IsDefined, ValidateNested, IsUUID, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class ServiceAccount {
  @IsString()
  readonly type: string;

  @IsString()
  readonly project_id: string;

  @IsString()
  readonly private_key_id: string;

  @IsString()
  readonly private_key: string;

  @IsString()
  readonly client_email: string;

  @IsString()
  readonly client_id: string;

  @IsString()
  readonly auth_uri: string;

  @IsString()
  readonly token_uri: string;

  @IsString()
  readonly auth_provider_x509_cert_url: string;

  @IsString()
  readonly client_x509_cert_url: string;
}

class FireBaseConfig {
  @IsString()
  readonly apiKey: string;
  
  @IsString()
  readonly authDomain: string;
  
  @IsString()
  readonly databaseURL: string;
  
  @IsString()
  readonly projectId: string;
  
  @IsString()
  readonly storageBucket: string;
  
  @IsString()
  readonly messagingSenderId: string;
  
  @IsString()
  readonly appId: string;
  
  @IsString()
  readonly measurementId: string;
}

export class CreateCompanyInput {
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  readonly uuid: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => ServiceAccount)
  readonly serviceAccount: ServiceAccount;

  @IsDefined()
  @ValidateNested()
  @Type(() => FireBaseConfig)
  readonly firebaseConfig;

  @IsString()
  readonly countryCode: string;
}
