import { IsString, IsUUID } from 'class-validator';

export class RemoveUserInput {
  @IsString()
  readonly companyUuid: string;

  @IsUUID()
  readonly uid: string;
}