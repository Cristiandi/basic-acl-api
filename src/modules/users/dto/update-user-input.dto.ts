import { IsOptional, IsEmail, IsString, Length } from 'class-validator';


export class UpdateUserInput {
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
}