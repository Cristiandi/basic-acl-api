import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ListParamInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;
}
