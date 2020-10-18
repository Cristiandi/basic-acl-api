import { IsUUID } from 'class-validator';

export class FindAllParamInput {
  @IsUUID()
  readonly companyUuid: string;
}