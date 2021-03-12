import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsJWT, IsString } from 'class-validator';

export class CheckPermissionGraphqlInput {
  @ApiProperty()
  @IsString()
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