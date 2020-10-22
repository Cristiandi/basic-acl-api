import { IsString, IsUrl, IsUUID, Length } from 'class-validator';

export class CreateInput {
  @IsUUID()
  readonly companyUuid: string;

  @IsString()
  @Length(5, 200)
  readonly subject: string;

  @IsString()
  @IsUrl()
  @Length(10, 200)
  readonly redirectUrl: string;
}