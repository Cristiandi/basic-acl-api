import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { Permission } from './permission.entity';
import { Project } from '../project/project.entity';
import { Role } from '../role/role.entity';

import { PermissionService } from './permission.service';
import { PermissionLoaders } from './permission.loaders';

import { CreatePermissionInput } from './dto/create-permission-input.dto';
import { GetOnePermissionInput } from './dto/get-one-permission-input.dto';
import { GetAllPermissionsInput } from './dto/get-all-permissions-input.dto';
import { ApiKey } from '../api-key/api-key.entity';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => Permission)
export class PermissionResolver {
  constructor(
    private readonly service: PermissionService,
    private readonly loaders: PermissionLoaders,
  ) {}

  @Mutation(() => Permission, { name: 'createPermission' })
  public create(
    @Args('createPermissionInput') input: CreatePermissionInput,
  ): Promise<Permission> {
    return this.service.create(input);
  }

  @Query(() => Permission, { name: 'getOnePermission', nullable: true })
  public getOne(
    @Args('fetOnePermissionInput') input: GetOnePermissionInput,
  ): Promise<Permission | undefined> {
    return this.service.getOne(input);
  }

  @Query(() => [Permission], { name: 'getAllPermissions', nullable: true })
  public getAll(
    @Args('getPermissionsInput') input: GetAllPermissionsInput,
  ): Promise<Permission[]> {
    return this.service.getAll(input);
  }

  @ResolveField(() => Project, { name: 'project' })
  public project(@Parent() parent: Permission): Promise<Project> {
    const value: any = parent.project;

    let id = value;

    if (typeof id !== 'number') id = value.id;

    return this.loaders.batchProjects.load(id);
  }

  @ResolveField(() => Role, { name: 'role' })
  public role(@Parent() parent: Permission): Promise<Role> {
    const value: any = parent.role;

    if (value) {
      let id = value;

      if (typeof id !== 'number') id = value.id;

      return this.loaders.batchRoles.load(id);
    }
  }

  @ResolveField(() => ApiKey, { name: 'apiKey' })
  public apiKey(@Parent() parent: Permission): Promise<ApiKey> {
    const value: any = parent.apiKey;

    if (value) {
      let id = value;

      if (typeof id !== 'number') id = value.id;

      return this.loaders.batchApiKeys.load(id);
    }
  }
}
