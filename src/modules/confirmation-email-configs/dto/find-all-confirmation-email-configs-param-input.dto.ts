import { IsUUID } from 'class-validator';

export class FindAllConfirmationEmailConfigsParamInput {
  @IsUUID()
  readonly companyUuid: string;
}