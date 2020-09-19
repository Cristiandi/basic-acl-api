import { IsUUID } from 'class-validator';

export class FindAllAssignedRolesParamInput {
  @IsUUID()
  readonly companyUuid: string;
}