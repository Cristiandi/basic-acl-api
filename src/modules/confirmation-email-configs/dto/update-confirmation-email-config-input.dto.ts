import { PartialType } from '@nestjs/mapped-types';
import { CreateConfirmationEmailCionfig } from './create-confirmation-email-config-input.dto';

export class UpdateConfirmationEmailConfigInput extends PartialType(CreateConfirmationEmailCionfig) {}