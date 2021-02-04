import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsUUID } from 'class-validator';

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
  @IsOptional()
  @IsInt()
  readonly httpRouteId?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  readonly graphqlActionId?: number;
}