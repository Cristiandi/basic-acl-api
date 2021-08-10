import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { Company } from './company.entity';

import { CompanyService } from './company.service';

import { CreateCompanyInput } from './dto/create-company-input.dto';
import { GetOneCompanyInput } from './dto/get-one-company-input.dto';
import { UpdateCompanyInput } from './dto/update-company-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => Company)
export class CompanyResolver {
  constructor(private readonly service: CompanyService) {}

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

  @Mutation(() => Company, { name: 'daleteCompany' })
  public delete(
    @Args('getOneCompanyInput') getOneCompanyInput: GetOneCompanyInput,
  ): Promise<Company> {
    return this.service.delete(getOneCompanyInput);
  }
}
