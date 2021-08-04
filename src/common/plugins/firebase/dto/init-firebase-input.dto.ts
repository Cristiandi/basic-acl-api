import { IsString } from 'class-validator';

export class InitFirebaseInput {
  @IsString()
  uuid: string;
}