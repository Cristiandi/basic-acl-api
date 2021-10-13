import * as DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { RoleService } from '../role/role.service';
import { UserService } from '../user/services/user.service';

@Injectable({ scope: Scope.REQUEST })
export class AssignedRoleLoaders {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  public readonly batchRoles = new DataLoader(async (masterIds: number[]) => {
    const masters = await this.roleService.getByIds(masterIds);
    const mastersMap = new Map(masters.map((item) => [item.id, item]));
    return masterIds.map((masterId) => mastersMap.get(masterId));
  });

  public readonly batchUsers = new DataLoader(async (masterIds: number[]) => {
    const masters = await this.userService.getByIds(masterIds);
    const mastersMap = new Map(masters.map((item) => [item.id, item]));
    return masterIds.map((masterId) => mastersMap.get(masterId));
  });
}
