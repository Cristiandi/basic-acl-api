import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindOneCompanyInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;
}