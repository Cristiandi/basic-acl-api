import { IsString } from 'class-validator';

export class GetCompanyByNameInput {
  @IsString()
  readonly name: string;
}