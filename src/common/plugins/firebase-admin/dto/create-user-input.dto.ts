import { IsString } from 'class-validator';

export class CreateUserInput {
  @IsString()
  readonly companyUuid: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly phone: string;

  @IsString()
  readonly countryCode: string;
}