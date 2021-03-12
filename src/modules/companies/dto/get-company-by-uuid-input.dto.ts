import { IsString } from 'class-validator';

export class GetCompanyByUuidInput {
  @IsString()
  readonly uuid: string;
}