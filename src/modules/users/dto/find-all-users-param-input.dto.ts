import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindAllUsersParamInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;
}