import { IsJWT, IsOptional, IsString, IsUUID } from 'class-validator';

export class CheckPermissionInput {
  @IsUUID()
  companyUuid: string;

  @IsString()
  projectCode: string;
  
  @IsJWT()
  token: string;

  @IsString()
  @IsOptional()
  requestedRoute?: string;

  @IsString()
  @IsOptional()
  requestedMethod?: string;
}