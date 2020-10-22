import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleInput } from './create-role-input.dto';

export class UpdateRoleInput extends PartialType(CreateRoleInput) {}