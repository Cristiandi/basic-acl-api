import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminOutPut {
  @ApiProperty()
  readonly companyUuid: string;

  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly authUid: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly accessToken: string;

  @ApiProperty()
  readonly authTime: number;

  @ApiProperty()
  readonly expirationTime: number;
}