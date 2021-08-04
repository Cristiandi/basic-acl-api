import { IsString } from 'class-validator';

export class GetOneByCompanyInput {
  @IsString()
  companyUuid: string;
}