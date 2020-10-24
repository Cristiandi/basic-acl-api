import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEmail } from 'class-validator';

export class SendForgottenPasswordEmailInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;
}
