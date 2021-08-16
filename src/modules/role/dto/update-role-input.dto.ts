import { InputType, PartialType } from '@nestjs/graphql';
import { CreateRoleInput } from './create-role-input.dto';

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {}
