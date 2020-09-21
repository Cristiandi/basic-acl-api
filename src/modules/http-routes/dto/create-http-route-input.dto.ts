import { IsInt, IsString, IsUUID, Length } from 'class-validator';

export class CreateHttpRouteInput {
  @IsUUID()
  readonly companyUuid: string;

  @IsString()
  @Length(3, 6)
  readonly method: string;

  @IsInt()
  readonly projectId: number;
}