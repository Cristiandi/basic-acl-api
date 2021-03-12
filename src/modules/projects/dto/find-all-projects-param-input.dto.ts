import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindAllProjectsParamInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;
}