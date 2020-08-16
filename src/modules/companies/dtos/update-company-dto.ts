import { PartialType } from '@nestjs/mapped-types'

import { CreateCompanyDto } from './create-company.dto'

const partialCreateCompanyDto = PartialType<CreateCompanyDto>(CreateCompanyDto)

export const updateCompanyDto = partialCreateCompanyDto

export class UpdateCoffeeDto extends PartialType(CreateCompanyDto) {}
