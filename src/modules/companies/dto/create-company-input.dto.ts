import { IsString, IsDefined, ValidateNested, IsUUID, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ServiceAccount {
  @ApiProperty()
  @IsString()
  readonly type: string;

  @ApiProperty()
  @IsString()
  readonly project_id: string;

  @ApiProperty()
  @IsString()
  readonly private_key_id: string;

  @ApiProperty()
  @IsString()
  readonly private_key: string;

  @ApiProperty()
  @IsString()
  readonly client_email: string;

  @ApiProperty()
  @IsString()
  readonly client_id: string;
  
  @ApiProperty()
  @IsString()
  readonly auth_uri: string;

  @ApiProperty()
  @IsString()
  readonly token_uri: string;

  @ApiProperty()
  @IsString()
  readonly auth_provider_x509_cert_url: string;

  @ApiProperty()
  @IsString()
  readonly client_x509_cert_url: string;
}

class FireBaseConfig {
  @ApiProperty()
  @IsString()
  readonly apiKey: string;
  
  @ApiProperty()
  @IsString()
  readonly authDomain: string;
  
  @ApiProperty()
  @IsString()
  readonly databaseURL: string;
  
  @ApiProperty()
  @IsString()
  readonly projectId: string;
  
  @ApiProperty()
  @IsString()
  readonly storageBucket: string;
  
  @ApiProperty()
  @IsString()
  readonly messagingSenderId: string;
  
  @ApiProperty()
  @IsString()
  readonly appId: string;
  
  @ApiProperty()
  @IsString()
  readonly measurementId: string;
}

export class CreateCompanyInput {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsUUID()
  readonly uuid: string;

  @ApiProperty({ type: () => ServiceAccount })
  @IsDefined()
  @ValidateNested()
  @Type(() => ServiceAccount)
  readonly serviceAccount: ServiceAccount;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly confirmationEmailConfig?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly forgottenPasswordConfig?: boolean;

  @ApiProperty({ type: () => FireBaseConfig })
  @IsDefined()
  @ValidateNested()
  @Type(() => FireBaseConfig)
  readonly firebaseConfig;

  @ApiProperty()
  @IsString()
  readonly countryCode: string;
}
