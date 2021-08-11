import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCompanyInput } from './create-company-input.dto';

@InputType()
export class UpdateCompanyInput extends PartialType(CreateCompanyInput) {}
