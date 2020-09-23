import { IsUUID } from 'class-validator';

export class InitAppInput {
  @IsUUID()
  readonly uuid: string;
}