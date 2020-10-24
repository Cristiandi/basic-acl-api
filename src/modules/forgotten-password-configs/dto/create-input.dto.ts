import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, IsUUID, Length } from 'class-validator';

export class CreateInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;

  @ApiProperty()
  @IsString()
  @Length(5, 200)
  readonly subject: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  @Length(10, 200)
  readonly redirectUrl: string;
}