import { PartialType } from '@nestjs/mapped-types';
import { CreateUserInput } from './create-user-input.dto';

export class UpdateUserInput extends PartialType(CreateUserInput) {}