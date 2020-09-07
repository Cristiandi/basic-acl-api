import { IsString, IsUUID } from 'class-validator';

export class VerifyTokenInput {
  @IsUUID()
  readonly companyUuid;

  @IsString()
  readonly token: string;
}