import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class ChangeEmailInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @Length(10, 10)
  @IsString()
  readonly phone: string;
}
