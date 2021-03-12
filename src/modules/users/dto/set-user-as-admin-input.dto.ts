import { IsString, IsEmail } from 'class-validator';

export class SetUserAsAdminInput {
  @IsString()
  readonly companyUuid: string;

  @IsEmail()
  readonly email: string;
}