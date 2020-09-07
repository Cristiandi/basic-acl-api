import { IsUUID } from 'class-validator';

export class GetFirebaseConfigInput {
  @IsUUID()
  uuid: string;
}