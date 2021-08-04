import { IsBoolean, IsString } from 'class-validator';

export class SetConfirmationEmailConfigFlagInput {
  @IsString()
  readonly uuid: string;

  @IsBoolean()
  readonly confirmationEmailConfig: boolean;
}