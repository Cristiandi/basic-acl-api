import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindAllConfirmationEmailConfigsParamInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;
}