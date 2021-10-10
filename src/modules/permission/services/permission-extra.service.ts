import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FirebaseAdminService } from '../../../plugins/firebase-admin/firebase-admin.service';

import { Permission } from '../permission.entity';

import { CheckPermissionInput } from '../dto/check-permission-input.dto';
import { CompanyService } from 'src/modules/company/services/company.service';
import { UserService } from 'src/modules/user/services/user.service';
import { AssignedRoleService } from 'src/modules/assigned-role/assigned-role.service';
import { ApiKeyService } from 'src/modules/api-key/api-key.service';
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
  ) {}

  public async checkPermission(
    input: CheckPermissionInput,
  ): Promise<Permission> {
    const { companyUid, permissionName, token, apiKey } = input;

    const company = await this.companyService.getOneByOneFields({
      fields: { uid: companyUid },
      checkIfExists: true,
    });

    if (token) {
      const verifiedToken = await this.firebaseAdminService.verifyToken({
        companyUid: company.uid,
        token,
      });

      const { uid } = verifiedToken;

      const user = await this.userService.getOneByOneFields({
        fields: {
          authUid: uid,
          company,
        },
        checkIfExists: true,
      });

      const assignedRoles = await this.assignedRoleService.getUserRoles({
        user,
      });

      const roles = assignedRoles.map((assignedRole) => assignedRole.role);

      if (!roles.length) {
        throw new ConflictException(`the user doesn't have assigned roles.`);
      }

      const permission = await this.permissionRepository
        .createQueryBuilder('permission')
        .where('permission.name = :name', { name: permissionName })
        .andWhere('permission.role_id in (:roles)', { roles })
        .getOne();

      if (!permission) {
        throw new ForbiddenException(`can't get the permission.`);
      }

      if (!permission.allowed) {
        throw new ForbiddenException(`the permission is not allowed.`);
      }

      return permission;
    }

    if (apiKey) {
      const apiKeyInstance = await this.apiKeyService.getOneByOneFields({
        fields: {
          value: apiKey,
          company,
        },
      });

      const permission = await this.permissionRepository
        .createQueryBuilder('permission')
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

      return permission;
    }
  }
}
