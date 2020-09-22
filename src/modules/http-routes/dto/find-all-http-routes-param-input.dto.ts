import { IsUUID } from 'class-validator';

export class FindAllHttpRoutesParamInput {
  @IsUUID()
  readonly companyUuid: string;
}