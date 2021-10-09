import * as DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { RoleService } from '../role/role.service';
import { ApiKeyService } from '../api-key/api-key.service';

@Injectable({ scope: Scope.REQUEST })
export class PermissionLoaders {
  constructor(
    private readonly roleService: RoleService,
    private readonly apiKeyService: ApiKeyService,
  ) {}

  public readonly batchRoles = new DataLoader(async (masterIds: number[]) => {
    const masters = await this.roleService.getByIds(masterIds);
    const mastersMap = new Map(masters.map((item) => [item.id, item]));
    return masterIds.map((masterId) => mastersMap.get(masterId));
  });

  public readonly batchApiKeys = new DataLoader(async (masterIds: number[]) => {
    const masters = await this.apiKeyService.getByIds(masterIds);
    const mastersMap = new Map(masters.map((item) => [item.id, item]));
    return masterIds.map((masterId) => mastersMap.get(masterId));
  });
}
