import { IsUUID } from 'class-validator';

export class FindAllApiKeysParamInput {
  @IsUUID()
  readonly companyUuid: string;
}