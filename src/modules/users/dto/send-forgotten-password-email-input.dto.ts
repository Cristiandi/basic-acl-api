import { IsUUID, IsEmail } from 'class-validator';

export class SendForgottenPasswordEmailInput {
  @IsUUID()
  readonly companyUuid: string;

  @IsEmail()
  readonly email: string;
}
