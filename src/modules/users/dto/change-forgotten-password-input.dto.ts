import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangeForgottenPasswordInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;

  @ApiProperty()
  @IsString()
  readonly code: string;

  @ApiProperty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsString()
  readonly confirmedPassword: string;
}