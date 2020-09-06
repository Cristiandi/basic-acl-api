import { IsUUID } from 'class-validator';

export class GetUserByUidInput {
  @IsUUID()
  readonly companyUuid: string;

  @IsUUID()
  readonly uid: string;
}