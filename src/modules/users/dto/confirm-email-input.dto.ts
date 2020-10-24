import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ConfirmEmailInput {
  @ApiProperty()
  @IsUUID()
  readonly  companyUuid: string;

  @ApiProperty()
  @IsString()
  readonly code: string;
}
