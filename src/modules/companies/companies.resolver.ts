import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { Company } from './company.entity';

import { CompaniesService } from './companies.service';

import { CreateCompanyInput } from './dto/create-company-input.dto';
import { GetOneCompanyInput } from './dto/get-one-company-input.dto';
import { UpdateCompanyInput } from './dto/update-company-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private readonly service: CompaniesService) {}

  @Mutation(() => Company, { name: 'createCompany' })
  public create(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
  ): Promise<Company> {
    return this.service.create(createCompanyInput);
  }

  @Query(() => Company, { name: 'getCompany', nullable: true })
  public getOne(
    @Args('getOneCompanyInput') getOneCompanyInput: GetOneCompanyInput,
  ): Promise<Company> {
    return this.service.getOne(getOneCompanyInput);
  }

  @Mutation(() => Company, { name: 'updateCompany' })
  public update(
    @Args('getOneCompanyInput') getOneCompanyInput: GetOneCompanyInput,
    @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
  ): Promise<Company> {
    return this.service.update(getOneCompanyInput, updateCompanyInput);
  }
}
