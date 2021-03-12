import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { FindOneInput as FindOneInputCommon } from '../../../common/dto/find-one-input.dto';

export class FindOneInput extends FindOneInputCommon {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;
}