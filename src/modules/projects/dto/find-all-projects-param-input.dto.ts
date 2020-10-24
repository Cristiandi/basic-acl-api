import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindAllProjectsParamInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;
}