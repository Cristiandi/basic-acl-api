import { IsString } from 'class-validator';

export class GetOneByCompanyInput {
  @IsString()
  readonly companyUuid: string;
}