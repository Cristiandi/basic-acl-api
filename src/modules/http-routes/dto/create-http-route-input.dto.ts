import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID, Length } from 'class-validator';

export class CreateHttpRouteInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;

  @ApiProperty()
  @IsString()
  @Length(5, 100)
  readonly name: string;

  @ApiProperty()
  @IsString()
  @Length(3, 6)
  readonly method: string;

  @ApiProperty()
  @IsString()
  @Length(5, 200)
  readonly path: string;

  @ApiProperty()
  @IsInt()
  readonly projectId: number;
}