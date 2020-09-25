import { IsJWT, IsUUID } from 'class-validator';

export class GetUserByTokenInput {
  @IsUUID()
  companyUuid: string;

  @IsJWT()
  token: string;
}