import { IsString, IsUUID, Length } from 'class-validator';

export class CreateApiKeyInput {
  @IsUUID()
  readonly companyUuid: string;

  @IsString()
  @Length(3, 5)
  readonly prefix: string;
}
