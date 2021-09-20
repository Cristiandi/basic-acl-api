import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Permission } from './permission.entity';

import { PermissionService } from './permission.service';

import { CreatePermissionInput } from './dto/create-permission-input.dto';
import { GetOnePermissionInput } from './dto/get-one-permission-input.dto';
import { GetAllPermissionsInput } from './dto/get-all-permissions-input.dto';
@Resolver()
export class PermissionResolver {
  constructor(private readonly service: PermissionService) {}

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
}
