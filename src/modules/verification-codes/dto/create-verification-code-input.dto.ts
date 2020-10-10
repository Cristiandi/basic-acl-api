import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateVerificationCodeInput {
  @IsDate()
  expirationDate: Date;

  @IsString()
  type: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}