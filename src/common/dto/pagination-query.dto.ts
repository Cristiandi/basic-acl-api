import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  limit: number;

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  offset: number;
}
