import { IsUUID } from 'class-validator';

export class GetOneByCompanyInput {
  @IsUUID()
  readonly companyUuid: string;
}