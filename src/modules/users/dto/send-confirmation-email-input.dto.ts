import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SendConfirmationEmailnput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;
}