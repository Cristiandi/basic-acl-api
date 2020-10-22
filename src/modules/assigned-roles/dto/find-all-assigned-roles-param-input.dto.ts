import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindAllAssignedRolesParamInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;
}