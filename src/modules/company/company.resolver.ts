import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { Company } from './company.entity';
import { Project } from '../project/project.entity';
import { ApiKey } from '../api-key/api-key.entity';

import { CompanyService } from './company.service';

import { CreateCompanyInput } from './dto/create-company-input.dto';
import { GetOneCompanyInput } from './dto/get-one-company-input.dto';
import { UpdateCompanyInput } from './dto/update-company-input.dto';
import { Role } from '../role/role.entity';

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

  @ResolveField(() => [Project], { name: 'projects' })
  public projects(@Parent() parent: Company): Promise<Project[]> {
    return this.service.projects(parent);
  }

  @ResolveField(() => [Role], { name: 'roles' })
  public roles(@Parent() parent: Company): Promise<Role[]> {
    return this.service.roles(parent);
  }

  @ResolveField(() => [Role], { name: 'apiKeys' })
  public apiKeys(@Parent() parent: Company): Promise<ApiKey[]> {
    return this.service.apiKeys(parent);
  }
}
