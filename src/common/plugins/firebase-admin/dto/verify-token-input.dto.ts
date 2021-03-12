import { IsString } from 'class-validator';

export class VerifyTokenInput {
  @IsString()
  readonly companyUuid;

  @IsString()
  readonly token: string;
}