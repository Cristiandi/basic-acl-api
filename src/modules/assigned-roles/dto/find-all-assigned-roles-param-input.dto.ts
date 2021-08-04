import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindAllAssignedRolesParamInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;
}