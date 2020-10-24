import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FindAllRolesParamInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;
}