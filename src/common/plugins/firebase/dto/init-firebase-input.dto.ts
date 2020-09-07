import { IsUUID } from 'class-validator';

export class InitFirebaseInput {
  @IsUUID()
  uuid: string;
}