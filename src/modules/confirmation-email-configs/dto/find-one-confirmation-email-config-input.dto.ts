import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { FindOneInput } from '../../../common/dto/find-one-input.dto';

export class FindOneConfirmationEmailConfigInput extends FindOneInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;
}