import { IsUUID } from 'class-validator';

export class GetUserByAuthUidInput {
  @IsUUID()
  readonly authUid: string;
}