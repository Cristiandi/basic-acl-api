import { IsBoolean, IsUUID } from 'class-validator';

export class SetForgottenPasswordFlagConfigFlagInput {
  @IsUUID()
  readonly uuid: string;

  @IsBoolean()
  readonly forgottenPasswordConfig: boolean;
}
