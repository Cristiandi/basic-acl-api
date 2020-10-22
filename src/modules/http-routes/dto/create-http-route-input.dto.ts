import { IsInt, IsString, IsUUID, Length } from 'class-validator';

export class CreateHttpRouteInput {
  @IsUUID()
  readonly companyUuid: string;

  @IsString()
  @Length(5, 100)
  readonly name: string;

  @IsString()
  @Length(3, 6)
  readonly method: string;

  @IsString()
  @Length(5, 200)
  readonly path: string;

  @IsInt()
  readonly projectId: number;
}