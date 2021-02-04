import { IsString, IsUUID } from 'class-validator';

export class GetUserAssignedRolesInput {
  @IsUUID()
  readonly companyUuid: string;

  @IsString()
  readonly authUid: string;
}