import { IsBoolean, IsString } from 'class-validator';

export class SetForgottenPasswordFlagConfigFlagInput {
  @IsString()
  readonly uuid: string;

  @IsBoolean()
  readonly forgottenPasswordConfig: boolean;
}
