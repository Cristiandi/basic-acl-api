import { IsEmail, IsString } from 'class-validator';

export class AssignInput {
  @IsString()
  readonly companyUuid: string;

  @IsEmail()
  readonly userEmail: string;

  @IsString()
  readonly roleCode: string;
}