import { IsString, Length, IsInt, IsOptional } from 'class-validator';

export class UpdateHttpRouteInput {
  @IsString()
  @Length(5, 100)
  @IsOptional()
  readonly name?: string;

  @IsString()
  @Length(3, 6)
  @IsOptional()
  readonly method?: string;

  @IsString()
  @Length(5, 200)
  @IsOptional()
  readonly path?: string;

  @IsInt()
  @IsOptional()
  readonly projectId?: number;
}