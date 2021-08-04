import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsString, Length } from 'class-validator';


export class UpdateUserInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(6, 100)
  readonly password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(10, 10)
  readonly phone?: string;
}