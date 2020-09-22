import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class UpdatePermissionInput {
  @IsBoolean()
  @IsOptional()
  readonly allowed?: boolean;

  @IsInt()
  @IsOptional()
  readonly roleId?: number;

  @IsInt()
  @IsOptional()
  readonly httpRouteId?: number;
}