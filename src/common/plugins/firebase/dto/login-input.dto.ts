import { IsString, IsUUID } from 'class-validator';

export class LoginInput {
  @IsUUID()
  companyUuid: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}