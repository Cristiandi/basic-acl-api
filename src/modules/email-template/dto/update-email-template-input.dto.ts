import { InputType, PartialType } from '@nestjs/graphql';
import { CreateEmailTemplateInput } from './create-email-template-input.dto';

@InputType()
export class UpdateEmailTemplateInput extends PartialType(
  CreateEmailTemplateInput,
) {}
