import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePermissionInput } from './create-permission-input.dto';

@InputType()
export class UpdatePermissionInput extends PartialType(CreatePermissionInput) {}
