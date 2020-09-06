import { IsString, IsUUID } from 'class-validator';

export class UpdateUserInput {
  @IsString()
  readonly companyUuid: string;

  @IsUUID()
  readonly uid: string;

  @IsString()
  readonly email?: string;

  @IsString()
  readonly password?: string;

  @IsString()
  readonly phone?: string;

  @IsString()
  readonly countryCode: string;
}