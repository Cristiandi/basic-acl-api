import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindAllConfirmationEmailConfigsParamInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;
}