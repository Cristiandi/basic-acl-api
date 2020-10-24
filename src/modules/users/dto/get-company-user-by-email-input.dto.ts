import { IsEmail, IsString } from 'class-validator';

export class GetCompanyUserByEmailInput {
  @IsString()
  readonly companyUuid: string;

  @IsEmail()
  readonly email: string;
}
