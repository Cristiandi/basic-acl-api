import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetByNameAndProjectInput {
  @ApiProperty()
  @IsString()
  readonly name: string;
  
  @ApiProperty()
  @IsNumber()
  readonly projectId: number;
}