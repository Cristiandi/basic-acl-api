import { IsUUID } from 'class-validator';

export class GetServiceAccountInput {
  @IsUUID()
  uuid: string;
}
