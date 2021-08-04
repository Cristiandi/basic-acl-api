import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetYourCompanyInput {
  @ApiProperty()
  @IsString()
  readonly uuid: string;
}