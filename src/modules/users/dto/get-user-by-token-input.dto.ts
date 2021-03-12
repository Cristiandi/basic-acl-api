import { IsJWT, IsString } from 'class-validator';

export class GetUserByTokenInput {
  @IsString()
  companyUuid: string;

  @IsJWT()
  token: string;
}