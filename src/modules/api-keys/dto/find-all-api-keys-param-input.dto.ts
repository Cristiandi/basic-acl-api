import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindAllApiKeysParamInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;
}