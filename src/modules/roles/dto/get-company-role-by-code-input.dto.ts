import { IsString } from 'class-validator';

export class GetCompanyRoleByCodeInput {
  @IsString()
  readonly companyUuid: string;

  @IsString()
  readonly code: string;
}
