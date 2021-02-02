import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindOneCompanyInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;
}