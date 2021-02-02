import { IsBoolean, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateInput {
  @IsString()
  name: string;

  @IsBoolean()
  isQuery: boolean;

  @IsBoolean()
  isMutation: boolean;

  @IsUUID()
  companyUuid: string;

  @IsNumber()
  projectId: number;
}