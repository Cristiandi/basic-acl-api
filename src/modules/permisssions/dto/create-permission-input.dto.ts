import { IsBoolean, IsInt, IsUUID } from 'class-validator';

export class CreatePermissionInput {
  @IsUUID()
  readonly companyUuid: string;

  @IsBoolean()
  readonly allowed: boolean;

  @IsInt()
  readonly roleId: number;

  @IsInt()
  readonly httpRouteId: number;
}