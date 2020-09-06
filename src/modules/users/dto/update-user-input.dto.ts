import { IsUUID, IsOptional, IsEmail, IsString, Length, IsBoolean } from 'class-validator';


export class UpdateUserInput {
  @IsUUID()
  readonly companyUuid: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  readonly password?: string;

  @IsOptional()
  @IsString()
  @Length(10, 10)
  readonly phone?: string;

  @IsOptional()
  @IsBoolean()
  readonly isAdmin?: boolean;
}