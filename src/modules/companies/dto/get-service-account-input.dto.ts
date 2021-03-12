import { IsString } from 'class-validator';

export class GetServiceAccountInput {
  @IsString()
  uuid: string;
}
