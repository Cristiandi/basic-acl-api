import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindAllUsersParamInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;
}