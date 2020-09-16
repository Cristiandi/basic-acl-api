import { IsUUID } from 'class-validator';

export class FindAllRolesParamInput {
  @IsUUID()
  readonly companyUuid: string;
}