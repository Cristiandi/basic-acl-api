import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BaseService } from '../../common/base.service';

import { Permission } from './permission.entity';

import { ApiKeyService } from '../api-key/api-key.service';
import { ProjectService } from '../project/project.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class PermissionService extends BaseService<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly projectService: ProjectService,
    private readonly roleService: RoleService,
    private readonly apiKeyService: ApiKeyService,
  ) {
    super(permissionRepository);
  }

  // CRUD

  public async create(input: any): Promise<Permission> {
    const { projectUid } = input;

    const project = await this.projectService.getOne({
      uid: projectUid,
    });

    if (!project) {
      throw new NotFoundException(`project with uid ${projectUid} not found.`);
    }

    const { roleUid } = input;

    const role = await this.roleService.getOne({
      uid: roleUid,
    });

    if (!role) {
      throw new NotFoundException(`role with uid ${roleUid} not found.`);
    }

    const { apiKeyUid } = input;

    let apiKey;

    if (apiKeyUid) {
      apiKey = await this.apiKeyService.getOne({
        uid: apiKeyUid,
      });
    }

    let existing = await this.getOneByOneFields({
      fields: {
        project,
        role,
        apiKey,
      },
    });

    if (existing) {
      throw new ConflictException(
        `already exists a permission for the project ${projectUid}, role ${roleUid} and api key ${apiKeyUid}.`,
      );
    }

    const { name } = input;

    existing = await this.getOneByOneFields({
      fields: {
        name,
        project,
      },
    });

    if (existing) {
      throw new ConflictException(
        `already exists a permission for the project ${projectUid} and name ${name}.`,
      );
    }

    const created = this.permissionRepository.create({
      name,
      allowed: true,
      project,
      role,
      apiKey,
    });

    const saved = await this.permissionRepository.save(created);

    return saved;
  }

  // CRUD
}
