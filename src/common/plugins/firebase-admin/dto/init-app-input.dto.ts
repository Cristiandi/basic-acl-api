import { IsString } from 'class-validator';

export class InitAppInput {
  @IsString()
  readonly uuid: string;
}