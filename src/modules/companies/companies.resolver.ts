import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { Company } from './company.entity';

import { CompaniesService } from './companies.service';

import { CreateCompanyInput } from './dto/create-company-input.dto';
import { GetOneCompanyInput } from './dto/get-one-company-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private readonly service: CompaniesService) {}

  @Mutation(() => Company, { name: 'createCompany' })
  public create(@Args('input') input: CreateCompanyInput): Promise<Company> {
    return this.service.create(input);
  }

  @Query(() => Company, { name: 'getCompany', nullable: true })
  public getOne(@Args('input') input: GetOneCompanyInput): Promise<Company> {
    return this.service.getOne(input);
  }
}
