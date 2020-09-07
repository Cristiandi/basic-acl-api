import { IsUUID } from 'class-validator';

export class GetUsersInput {
  @IsUUID()
  readonly companyUuid: string;
}