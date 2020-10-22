import { IsUUID } from 'class-validator';

export class GetOneByCompanyInput {
  @IsUUID()
  companyUuid: string;
}