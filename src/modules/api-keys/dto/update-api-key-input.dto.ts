import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateApiKeyInput {
  @IsOptional()
  @IsBoolean()
  readonly enable?: boolean;
}
