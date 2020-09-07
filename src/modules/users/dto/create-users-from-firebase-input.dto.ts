import { IsUUID } from 'class-validator';

export class CreateUsersFromFirebaseInput {
  @IsUUID()
  readonly companyUuid: string;
}
