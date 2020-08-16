import { IsOptional, IsNumberString } from 'class-validator'

export class PaginationQueryDto {
  @IsOptional()
  @IsNumberString()
  limit!: number;

  @IsOptional()
  @IsNumberString()
  offset!: number;
}
