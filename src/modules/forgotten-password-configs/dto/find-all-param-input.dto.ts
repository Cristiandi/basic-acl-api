import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindAllParamInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;
}