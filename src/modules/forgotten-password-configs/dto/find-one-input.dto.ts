import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { FindOneInput as FindOneInputCommon } from '../../../common/dto/find-one-input.dto';

export class FindOneInput extends FindOneInputCommon {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;
}