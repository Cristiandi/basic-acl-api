import { IsUUID, IsEmail } from 'class-validator';

export class CreateUserFromFirebaseInput {
  @IsUUID()
  readonly companyUuid: string;

  @IsEmail()
  readonly email: string;

  @IsUUID()
  readonly authUid: string;
}