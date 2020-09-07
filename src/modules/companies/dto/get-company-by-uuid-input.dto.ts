import { IsUUID } from 'class-validator';

export class GetCompanyByUuidInput {
  @IsUUID()
  readonly uuid: string;
}