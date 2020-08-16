import { IsNumberString } from 'class-validator'

export class FindOneCompanyDto {
  @IsNumberString()
  id!: string;
}
