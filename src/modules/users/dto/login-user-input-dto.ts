import { IsString } from 'class-validator';

export class LoginUserInput {
  @IsString()
  companyName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;
}