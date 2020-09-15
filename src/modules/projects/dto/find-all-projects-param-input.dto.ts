import { IsUUID } from 'class-validator';

export class FindAllProjectsParamInput {
  @IsUUID()
  readonly companyUuid: string;
}