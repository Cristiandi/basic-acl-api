import { IsEmail, IsString } from 'class-validator';

export class SendUpdatedPasswordNotificationEmailInput {
  @IsString()
  readonly companyUuid: string;

  @IsEmail()
  readonly email: string;
}