import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ConfirmEmailInput {
  @ApiProperty()
  @IsString()
  readonly  companyUuid: string;

  @ApiProperty()
  @IsString()
  readonly code: string;
}
