import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsJWT, IsString, IsUUID } from 'class-validator';

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
  @IsArray()
  graphqlActionNames: string[];
}