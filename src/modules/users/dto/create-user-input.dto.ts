import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsBoolean, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateUserInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @Length(6, 100)
  readonly password: string;

  @ApiProperty()
  @IsString()
  @Length(10, 10)
  readonly phone: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  readonly isAdmin?: boolean;
}