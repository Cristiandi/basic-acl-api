import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateInput {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsBoolean()
  readonly isQuery?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly isMutation?: boolean;

  @IsOptional()
  @IsUUID()
  readonly companyUuid?: string;

  @IsOptional()
  @IsNumber()
  readonly projectId?: number;
}