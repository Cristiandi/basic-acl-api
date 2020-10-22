import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsUUID } from 'class-validator';

export class CreatePermissionInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;

  @ApiProperty()
  @IsBoolean()
  readonly allowed: boolean;

  @ApiProperty()
  @IsInt()
  readonly roleId: number;

  @ApiProperty()
  @IsInt()
  readonly httpRouteId: number;
}