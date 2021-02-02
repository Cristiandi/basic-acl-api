import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ListParamInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;
}
