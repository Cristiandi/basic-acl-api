import { IsString } from 'class-validator';

export class ChangeForgottenPasswordInput {
  @IsString()
  readonly companyUuid: string;

  @IsString()
  readonly code: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly confirmedPassword: string;
}