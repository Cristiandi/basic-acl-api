import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsOptional, IsString, IsUUID } from 'class-validator';

export class CheckPermissionInput {
  @ApiProperty()
  @IsUUID()
  companyUuid: string;

  @ApiProperty()
  @IsString()
  projectCode: string;
  
  @ApiProperty()
  @IsJWT()
  token: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  requestedRoute?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  requestedMethod?: string;
}