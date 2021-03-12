import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class SendForgottenPasswordEmailInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;
}
