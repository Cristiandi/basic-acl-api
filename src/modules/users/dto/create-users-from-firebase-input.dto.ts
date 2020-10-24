import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateUsersFromFirebaseInput {
  @ApiProperty()
  @IsUUID()
  readonly companyUuid: string;
}
