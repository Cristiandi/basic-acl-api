import { IsEmail, IsString, IsUrl, IsUUID, Length } from 'class-validator';

export class CreateConfirmationEmailCionfig {
  @IsUUID()
  readonly companyUuid: string;

  @IsString()
  @IsEmail()
  @Length(5, 100)
  readonly from: string;

  @IsString()
  @Length(5, 200)
  readonly subject: string;

  @IsString()
  @IsUrl()
  @Length(10, 200)
  readonly redirectUrl: string;
}