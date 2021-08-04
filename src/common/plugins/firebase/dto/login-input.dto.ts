import { IsString } from 'class-validator';

export class LoginInput {
  @IsString()
  companyUuid: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}