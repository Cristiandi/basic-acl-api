import { IsString, Length } from 'class-validator';

export class ConfirmUserEmailInput {
  @Length(10)
  @IsString()
  readonly code: string;
}
