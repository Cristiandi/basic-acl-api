import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUsersFromFirebaseInput {
  @ApiProperty()
  @IsString()
  readonly companyUuid: string;
}
