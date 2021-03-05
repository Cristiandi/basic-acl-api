import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly isAdmin?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly roleCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly anonymous?: boolean;
}