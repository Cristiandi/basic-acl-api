import { IsUUID, IsEmail } from 'class-validator';

export class SetUserAsAdminInput {
  @IsUUID()
  readonly companyUuid: string;

  @IsEmail()
  readonly email: string;
}