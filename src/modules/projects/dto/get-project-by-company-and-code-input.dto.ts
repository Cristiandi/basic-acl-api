import { IsString, IsUUID } from 'class-validator';

export class GetProjectByCompanyAndCodeInput {
  @IsUUID()
  companyUuid: string;

  @IsString()
  code: string;
}