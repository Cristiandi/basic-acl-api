import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class GetYourCompanyInput {
  @ApiProperty()
  @IsString()
  readonly uuid: string;
}