import { IsString } from 'class-validator';

export class GetUserByUidInput {
  @IsString()
  readonly companyUuid: string;

  @IsString()
  readonly uid: string;
}