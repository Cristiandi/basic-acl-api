import { IsUUID, IsString, Length, IsInt, IsOptional } from 'class-validator';

export class UpdateHttpRouteInput {
  @IsUUID()
  readonly companyUuid: string;

  @IsString()
  @Length(3, 6)
  @IsOptional()
  readonly method?: string;

  @IsInt()
  @IsOptional()
  readonly projectId?: number;
}