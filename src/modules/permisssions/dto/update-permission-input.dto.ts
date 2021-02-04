import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class UpdatePermissionInput {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  readonly allowed?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  readonly roleId?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  readonly httpRouteId?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  readonly graphqlActionId?: number;
}