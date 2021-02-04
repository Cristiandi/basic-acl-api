import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CheckPermissionGraphqlOutput {
  @ApiProperty()
  @IsBoolean()
  allowed: boolean;

  @ApiProperty()
  @IsString()
  reason: string;
}