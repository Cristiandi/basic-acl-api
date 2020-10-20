import { IsString, IsUUID } from 'class-validator';

export class LoginUserInput {
  @IsUUID()
  @IsString()
  companyUuid: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}