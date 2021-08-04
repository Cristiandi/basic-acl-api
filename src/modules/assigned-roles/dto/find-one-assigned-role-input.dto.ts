import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { FindOneInput } from '../../../common/dto/find-one-input.dto';

export class FindOneAssignedRoleInput extends FindOneInput {
  @ApiProperty()
  @IsString()
    readonly companyUuid: string;
}