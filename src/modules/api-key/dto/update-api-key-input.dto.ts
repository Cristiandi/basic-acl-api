import { InputType, PartialType } from '@nestjs/graphql';
import { CreateApiKeyInput } from './create-api-key-input.dto';

@InputType()
export class UpdateApiKeyInput extends PartialType(CreateApiKeyInput) {}
