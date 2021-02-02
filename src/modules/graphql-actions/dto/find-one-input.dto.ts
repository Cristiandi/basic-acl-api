import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { FindOneInput as DefaultFindOneInput } from '../../../common/dto/find-one-input.dto';

export class FindOneInput extends DefaultFindOneInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;
}