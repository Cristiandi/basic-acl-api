import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class GetByNameAndProjectInput {
  @ApiProperty()
  @IsArray()
  @IsString()
  readonly names: string[];
  
  @ApiProperty()
  @IsNumber()
  readonly projectId: number;
}