import { IsString } from 'class-validator';

export class GetProjectByCompanyAndCodeInput {
  @IsString()
  companyUuid: string;

  @IsString()
  code: string;
}