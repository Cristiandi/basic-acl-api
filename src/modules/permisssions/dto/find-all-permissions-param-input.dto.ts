import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindAllPermissionsParamInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;
}