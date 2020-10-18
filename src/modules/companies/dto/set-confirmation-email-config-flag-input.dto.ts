import { IsBoolean, IsUUID } from 'class-validator';

export class SetConfirmationEmailConfigFlagInput {
  @IsUUID()
  readonly uuid: string;

  @IsBoolean()
  readonly confirmationEmailConfig: boolean;
}