import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { Role } from './role.entity';
import { Company } from '../company/company.entity';

import { RoleService } from './role.service';
import { RoleLoaders } from './role.loaders';

import { CreateRoleInput } from './dto/create-role-input.dto';
import { GetOneRoleInput } from './dto/get-one-role-input.dto';
import { GetAllRolesInput } from './dto/get-all-role-input.dto';
import { UpdateRoleInput } from './dto/update-role-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => Role)
export class RoleResolver {
  constructor(
    private readonly service: RoleService,
    private readonly loaders: RoleLoaders,
  ) {}

  @Mutation(() => Role, { name: 'createRole' })
  public create(
    @Args('createRoleInput') input: CreateRoleInput,
  ): Promise<Role> {
    return this.service.create(input);
  }

  @Query(() => Role, { name: 'getOneRole', nullable: true })
  public getOne(
    @Args('getOneRoleInput') input: GetOneRoleInput,
  ): Promise<Role | undefined> {
    return this.service.getOne(input);
  }

  @Query(() => [Role], { name: 'getAllRoles', nullable: true })
  public getAll(
    @Args('getRolesInput') input: GetAllRolesInput,
  ): Promise<Role[]> {
    return this.service.getAll(input);
  }

  @Mutation(() => Role, { name: 'updateRole' })
  public update(
    @Args('getOneRoleInput') getOneRoleInput: GetOneRoleInput,
    @Args('updateRoleInput') input: UpdateRoleInput,
  ): Promise<Role> {
    return this.service.update(getOneRoleInput, input);
  }

  @Mutation(() => Role, { name: 'deleteRole' })
  public delete(
    @Args('getOneRoleInput') input: GetOneRoleInput,
  ): Promise<Role> {
    return this.service.delete(input);
  }

  @ResolveField(() => Company, { name: 'company' })
  company(@Parent() role: Role): Promise<Company> {
    const value: any = role.company;

    let id = value;

    if (typeof id !== 'number') id = value.id;

    return this.loaders.batchCompanies.load(id);
  }
}
