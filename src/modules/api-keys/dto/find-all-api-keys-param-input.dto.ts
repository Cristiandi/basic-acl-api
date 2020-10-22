import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindAllApiKeysParamInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;
}