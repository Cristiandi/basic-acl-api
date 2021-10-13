import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { AssignedRole } from './assigned-role.entity';
import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';

import { AssignedRoleService } from './assigned-role.service';
import { AssignedRoleLoaders } from './assigned-role.loaders';

import { CreateAssignedRoleInput } from './dto/create-assigned-role-input.dto';
import { GetAllAssignedRolesInput } from './dto/get-all-assigned-roles-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => AssignedRole)
export class AssignedRoleResolver {
  constructor(
    private readonly service: AssignedRoleService,
    private readonly loaders: AssignedRoleLoaders,
  ) {}

  @Mutation(() => AssignedRole, { name: 'createAssignedRole' })
  public create(
    @Args('createAssignedRoleInput') input: CreateAssignedRoleInput,
  ): Promise<AssignedRole> {
    return this.service.create(input);
  }

  @Query(() => [AssignedRole], { name: 'getAllAssignedRoles' })
  public getAll(
    @Args('getAllAssignedRolesInput') input: GetAllAssignedRolesInput,
  ): Promise<AssignedRole[]> {
    return this.service.getAll(input);
  }

  @ResolveField(() => Role, { name: 'role' })
  public role(@Parent() parent: AssignedRole): Promise<Role> {
    const value: any = parent.role;

    if (value) {
      let id = value;

      if (typeof id !== 'number') id = value.id;

      return this.loaders.batchRoles.load(id);
    }
  }

  @ResolveField(() => User, { name: 'user' })
  public user(@Parent() parent: AssignedRole): Promise<User> {
    const value: any = parent.user;

    if (value) {
      let id = value;

      if (typeof id !== 'number') id = value.id;

      return this.loaders.batchUsers.load(id);
    }
  }
}
