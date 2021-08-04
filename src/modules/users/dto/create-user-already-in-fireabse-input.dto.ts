import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, Length, IsBoolean } from 'class-validator';

export class CreateUserAlreadyInFirebaseInput {
  @ApiProperty()
  @IsString()
  readonly authUid: string;
  
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly roleCode?: string;
}