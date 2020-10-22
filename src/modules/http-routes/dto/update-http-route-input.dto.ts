import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsInt, IsOptional } from 'class-validator';

export class UpdateHttpRouteInput {
  @ApiProperty()
  @IsString()
  @Length(5, 100)
  @IsOptional()
  readonly name?: string;

  @ApiProperty()
  @IsString()
  @Length(3, 6)
  @IsOptional()
  readonly method?: string;

  @ApiProperty()
  @IsString()
  @Length(5, 200)
  @IsOptional()
  readonly path?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  readonly projectId?: number;
}