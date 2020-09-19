import { IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreateAssignedRoleInput {
  @IsUUID()
  readonly companyUuid: string;

  @IsInt()
  readonly roleId: number;

  @IsOptional()
  @IsInt()
  readonly userId?: number;

  @IsOptional()
  @IsInt()
  readonly apiKeyId?: number;
}