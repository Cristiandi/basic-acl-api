import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindAllPermissionsParamInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;
}