import { IsUUID } from 'class-validator';

export class FindAllPermissionsParamInput {
  @IsUUID()
  readonly companyUuid: string;
}