import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetUserAssignedRolesInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;

  @ApiProperty()
  @IsString()
  readonly authUid: string;
}