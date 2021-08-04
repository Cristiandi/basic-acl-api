import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindAllHttpRoutesParamInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;
}