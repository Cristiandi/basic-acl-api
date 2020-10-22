import { IsUUID, IsString, IsEmail, Length } from 'class-validator';

export class CreateCompanyAdminInput {
  @IsUUID()
  readonly companyUuid: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(6, 100)
  readonly password: string;

  @IsString()
  @Length(10, 10)
  readonly phone: string;
}