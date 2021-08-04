import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateInput {
  @IsString()
  name: string;

  @IsBoolean()
  isQuery: boolean;

  @IsBoolean()
  isMutation: boolean;

  @IsString()
  companyUuid: string;

  @IsNumber()
  projectId: number;
}