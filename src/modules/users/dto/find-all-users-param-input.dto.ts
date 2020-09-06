import { IsUUID } from 'class-validator';

export class FindAllUsersParamInput {
  @IsUUID()
  readonly companyUuid: string;
}