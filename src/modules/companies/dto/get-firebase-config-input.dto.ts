import { IsString } from 'class-validator';

export class GetFirebaseConfigInput {
  @IsString()
  uuid: string;
}