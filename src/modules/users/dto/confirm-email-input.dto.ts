import { IsString, IsUUID } from 'class-validator';

export class ConfirmEmailInput {
  @IsUUID()
  readonly  companyUuid: string;

  @IsString()
  readonly code: string;
}
