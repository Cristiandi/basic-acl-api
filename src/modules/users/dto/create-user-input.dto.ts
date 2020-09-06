import { IsUUID, IsString, IsBoolean, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateUserInput {
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

  @IsOptional()
  @IsBoolean()
  readonly isAdmin: boolean;
}