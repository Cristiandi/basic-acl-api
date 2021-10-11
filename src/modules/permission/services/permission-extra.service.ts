import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FirebaseAdminService } from '../../../plugins/firebase-admin/firebase-admin.service';

import { Permission } from '../permission.entity';

import { CompanyService } from 'src/modules/company/services/company.service';
import { UserService } from 'src/modules/user/services/user.service';
import { AssignedRoleService } from 'src/modules/assigned-role/assigned-role.service';
import { ApiKeyService } from 'src/modules/api-key/api-key.service';

import { CheckPermissionInput } from '../dto/check-permission-input.dto';
import { RedisCacheService } from 'src/plugins/redis-cache/redis-cache.service';
@Injectable()
export class PermissionExtraService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly companyService: CompanyService,
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly userService: UserService,
    private readonly assignedRoleService: AssignedRoleService,
    private readonly apiKeyService: ApiKeyService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  public async checkPermission(
    input: CheckPermissionInput,
  ): Promise<Permission> {
    const { companyUid, permissionName, token, apiKey } = input;

    // check token n apiKey
    if (!token && !apiKey) {
      throw new BadRequestException('token or apiKey is required.');
    }

    if (token && apiKey) {
      throw new BadRequestException(
        'token and apiKey can not be used at same time.',
      );
    }

    // get the company
    const company = await this.companyService.getOneByOneFields({
      fields: { uid: companyUid },
      checkIfExists: true,
    });

    // if token is provided
    if (token) {
      // check the cache
      const cache = await this.redisCacheService.get({
        keys: {
          companyUid,
          permissionName,
          token,
        },
      });

      if (cache) {
        return cache as Permission;
      }

      let verifiedToken;

      // try to verify token
      try {
        verifiedToken = await this.firebaseAdminService.verifyToken({
          companyUid: company.uid,
          token,
        });
      } catch (error) {
        throw new UnauthorizedException(error.message);
      }

      // get the user
      const { uid } = verifiedToken;

      const user = await this.userService.getOneByOneFields({
        fields: {
          authUid: uid,
          company,
        },
        checkIfExists: true,
      });

      // get the assigned roles
      const assignedRoles = await this.assignedRoleService.getUserRoles({
        user,
      });

      const roles = assignedRoles.map((assignedRole) => assignedRole.role);

      if (!roles.length) {
        throw new ConflictException(`the user doesn't have assigned roles.`);
      }

      // try to get the permission
      const permission = await this.permissionRepository
        .createQueryBuilder('permission')
        .loadAllRelationIds()
        .where('permission.name = :name', { name: permissionName })
        .andWhere('permission.role_id IN (:...roles)', {
          roles: roles.map((role) => role.id),
        })
        .getOne();

      if (!permission) {
        throw new ForbiddenException(`can't get the permission.`);
      }

      if (!permission.allowed) {
        throw new ForbiddenException(`the permission is not allowed.`);
      }

      // set the cache
      await this.redisCacheService.set({
        keys: {
          companyUid,
          permissionName,
          token,
        },
        value: permission,
        ttl: 60 * 60 * 24,
      });

      return permission;
    }

    // if apiKey is provided
    if (apiKey) {
      // check the cache
      const cache = await this.redisCacheService.get({
        keys: {
          companyUid,
          permissionName,
          apiKey,
        },
      });

      if (cache) {
        return cache as Permission;
      }

      // get the apiKey
      const apiKeyInstance = await this.apiKeyService.getOneByOneFields({
        fields: {
          value: apiKey,
          company,
        },
      });

      // try to get the permission
      const permission = await this.permissionRepository
        .createQueryBuilder('permission')
        .loadAllRelationIds()
        .where('permission.name = :name', { name: permissionName })
        .andWhere('permission.api_key_id = :apiKey', {
          apiKey: apiKeyInstance.id,
        })
        .getOne();

      if (!permission) {
        throw new ForbiddenException(`can't get the permission.`);
      }

      if (!permission.allowed) {
        throw new ForbiddenException(`the permission is not allowed.`);
      }

      // set the cache
      await this.redisCacheService.set({
        keys: {
          companyUid,
          permissionName,
          apiKey,
        },
        value: permission,
        ttl: 60 * 60 * 24,
      });

      return permission;
    }
  }
}
