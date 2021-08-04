import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindAllParamInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;
}