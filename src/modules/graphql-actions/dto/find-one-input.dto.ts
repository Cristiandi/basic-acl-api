import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { FindOneInput as DefaultFindOneInput } from '../../../common/dto/find-one-input.dto';

export class FindOneInput extends DefaultFindOneInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;
}