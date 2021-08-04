import { PartialType } from '@nestjs/mapped-types';
import { CreateInput } from './create-input.dto';

export class UpdateInput extends PartialType(CreateInput) {}
