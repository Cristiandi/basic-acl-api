import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectInput } from './create-project-input.dto';

export class UpdateProjectInput extends PartialType(CreateProjectInput) {}