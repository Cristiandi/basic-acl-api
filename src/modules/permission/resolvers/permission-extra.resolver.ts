import { Args, Query, Resolver } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';

import { Public } from '../../../common/decorators/public.decorator';

import { Permission } from '../permission.entity';

import { PermissionExtraService } from '../services/permission-extra.service';

import { CheckPermissionInput } from '../dto/check-permission-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => Permission)
export class PermissionExtraResolver {
  constructor(private readonly service: PermissionExtraService) {}

  @Public()
  @Query(() => Permission, { name: 'checkPermission', nullable: true })
  public getOne(
    @Args('checkPermissionInput') input: CheckPermissionInput,
  ): Promise<Permission | undefined> {
    return this.service.checkPermission(input);
  }
}
