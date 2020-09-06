import { IsUUID, IsString, IsBoolean } from 'class-validator';

export class CreateUserInput {
  @IsUUID()
  readonly companyUuid: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly phone: string;

  @IsBoolean()
  readonly isAdmin: boolean;
}