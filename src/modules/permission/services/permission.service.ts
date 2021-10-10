import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BaseService } from '../../../common/base.service';

import { Permission } from '../permission.entity';

import { ApiKeyService } from '../../api-key/api-key.service';
import { RoleService } from '../../role/role.service';

import { CreatePermissionInput } from '../dto/create-permission-input.dto';
import { GetOnePermissionInput } from '../dto/get-one-permission-input.dto';
import { GetAllPermissionsInput } from '../dto/get-all-permissions-input.dto';
import { UpdatePermissionInput } from '../dto/update-permission-input.dto';

@Injectable()
export class PermissionService extends BaseService<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly roleService: RoleService,
    private readonly apiKeyService: ApiKeyService,
  ) {
    super(permissionRepository);
  }

  // CRUD

  public async create(input: CreatePermissionInput): Promise<Permission> {
    const { roleUid } = input;

    let role;

    if (roleUid) {
      role = await this.roleService.getOne({
        uid: roleUid,
      });

      if (!role) {
        throw new NotFoundException(`role with uid ${roleUid} not found.`);
      }
    }

    const { apiKeyUid } = input;

    let apiKey;

    if (apiKeyUid) {
      apiKey = await this.apiKeyService.getOne({
        uid: apiKeyUid,
      });

      if (!apiKey) {
        throw new NotFoundException(`apiKey with uid ${apiKeyUid} not found.`);
      }
    }

    if (!role && !apiKey) {
      throw new ConflictException('must provide either a role or an apiKey.');
    }

    if (role && apiKey) {
      throw new ConflictException(`apiKey and role cannot be both defined.`);
    }

    const { name } = input;

    const existing = await this.getOneByOneFields({
      fields: {
        role,
        apiKey,
        name,
      },
    });

    if (existing) {
      throw new ConflictException(
        `already exists a permission for the name ${name} role ${roleUid} and api key ${apiKeyUid}.`,
      );
    }

    const created = this.permissionRepository.create({
      name,
      allowed: true,
      role,
      apiKey,
    });

    const saved = await this.permissionRepository.save(created);

    return saved;
  }

  public async getOne(
    input: GetOnePermissionInput,
  ): Promise<Permission | undefined> {
    const { uid } = input;

    const existing = await this.getOneByOneFields({
      fields: { uid },
      checkIfExists: false,
      relations: ['role', 'apiKey'],
    });

    return existing;
  }

  public async getAll(input: GetAllPermissionsInput): Promise<Permission[]> {
    const { companyUid, limit, skip, q } = input;

    const query = this.permissionRepository
      .createQueryBuilder('permission')
      .loadAllRelationIds()
      .leftJoin('permission.role', 'role')
      .leftJoin('role.company', 'roleCompany')
      .leftJoin('permission.apiKey', 'apiKey')
      .leftJoin('apiKey.company', 'apiKeyCompany')
      .where(
        '(roleCompany.uid = :companyUid or apiKeyCompany.uid = :companyUid)',
        { companyUid },
      );

    if (q)
      query.andWhere('permission.name ilike :q', {
        q: `%${q}%`,
      });

    query.limit(limit || 10).skip(skip);

    const items = await query.getMany();

    return items;
  }

  public async update(
    getOnePermissionInput: GetOnePermissionInput,
    input: UpdatePermissionInput,
  ): Promise<Permission> {
    const { uid } = getOnePermissionInput;

    const existing = await this.getOneByOneFields({
      fields: { uid },
      checkIfExists: true,
    });

    const { roleUid, apiKeyUid } = input;

    if (roleUid && apiKeyUid) {
      throw new ConflictException(`apiKey and role cannot be both defined.`);
    }

    let role;
    if (roleUid) {
      role = await this.roleService.getOne({
        uid: roleUid,
      });

      if (!role) {
        throw new NotFoundException(`role with uid ${roleUid} not found.`);
      }
    }

    let apiKey;
    if (apiKeyUid) {
      apiKey = await this.apiKeyService.getOne({
        uid: apiKeyUid,
      });

      if (!apiKey) {
        throw new NotFoundException(`apiKey with uid ${apiKeyUid} not found.`);
      }
    }

    const { name } = input;

    const existingForCheck = await this.getOneByOneFields({
      fields: {
        role,
        apiKey,
        name,
      },
    });

    if (existingForCheck) {
      throw new ConflictException(
        `already exists a permission for name ${name} role ${roleUid} and api key ${apiKeyUid}.`,
      );
    }

    const preloaded = await this.permissionRepository.preload({
      id: existing.id,
      name: input.name || existing.name,
      role: role || existing.role,
      apiKey: apiKey || existing.apiKey,
    });

    const saved = await this.permissionRepository.save(preloaded);

    return {
      ...existing,
      ...saved,
    } as Permission;
  }

  public async delete(input: GetOnePermissionInput): Promise<Permission> {
    const { uid } = input;

    const existing = await this.getOneByOneFields({
      fields: { uid },
      checkIfExists: true,
    });

    const clone = { ...existing };

    await this.permissionRepository.remove(existing);

    return clone as Permission;
  }

  // CRUD
}
