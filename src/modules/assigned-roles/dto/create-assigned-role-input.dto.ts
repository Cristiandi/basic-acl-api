import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAssignedRoleInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;

  @ApiProperty()
  @IsInt()
  readonly roleId: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  readonly userId?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  readonly apiKeyId?: number;
}