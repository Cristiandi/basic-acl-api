import { IsString } from 'class-validator';

export class RemoveUserInput {
  @IsString()
  readonly companyUuid: string;

  @IsString()
  readonly uid: string;
}