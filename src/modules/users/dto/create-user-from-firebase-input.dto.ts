import { IsString, IsEmail } from 'class-validator';

export class CreateUserFromFirebaseInput {
  @IsString()
  readonly companyUuid: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly authUid: string;
}