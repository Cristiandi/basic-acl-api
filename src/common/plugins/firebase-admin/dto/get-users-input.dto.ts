import { IsString } from 'class-validator';

export class GetUsersInput {
  @IsString()
  readonly companyUuid: string;
}