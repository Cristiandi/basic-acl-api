import { IsEmail, IsUUID } from 'class-validator';

export class SendConfirmationEmailnput {
  @IsUUID()
  readonly companyUuid: string;

  @IsEmail()
  readonly email: string;
}