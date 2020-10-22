import { IsBoolean, IsString } from 'class-validator';

export class CheckPermissionOutput {
  @IsBoolean()
  allowed: boolean;

  @IsString()
  reason: string;
}