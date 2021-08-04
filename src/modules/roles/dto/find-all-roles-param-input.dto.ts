import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindAllRolesParamInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;
}