import { IsUUID } from 'class-validator';

export class GetYourCompanyInput {
  @IsUUID()
  readonly uuid: string;
}