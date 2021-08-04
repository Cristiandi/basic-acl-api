import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length } from 'class-validator';

export class CreateCompanyAdminInput {
  @ApiProperty()
  @IsString()
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
}