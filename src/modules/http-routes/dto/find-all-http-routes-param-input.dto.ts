import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindAllHttpRoutesParamInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;
}