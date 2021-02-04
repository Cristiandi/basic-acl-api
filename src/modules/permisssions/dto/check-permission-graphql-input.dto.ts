import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString, IsUUID } from 'class-validator';

export class CheckPermissionGraphqlInput {
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
  graphqlActionName?: string;
}