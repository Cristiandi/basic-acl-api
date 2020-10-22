import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUUID } from 'class-validator';

export class SendConfirmationEmailnput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;
}