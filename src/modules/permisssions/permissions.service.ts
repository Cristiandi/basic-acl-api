import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { pathToRegexp } from 'path-to-regexp';

import { Permission } from './permission.entity';

import { HttpRoutesService } from '../http-routes/http-routes.service';
import { RolesService } from '../roles/roles.service';

import { CreatePermissionInput } from './dto/create-permission-input.dto';
import { FindAllPermissionsParamInput } from './dto/find-all-permissions-param-input.dto';
import { FindAllPermissionsQueryInput } from './dto/find-all-permissions-query-input.dto';
import { FindOnePermissionInput } from './dto/find-one-permission-input.dto';
import { UpdatePermissionInput } from './dto/update-permission-input.dto';
import { CheckPermissionInput } from './dto/check-permission-input.dto';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { CheckPermissionOutput } from './dto/check-permission-output.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly rolesService: RolesService,
    private readonly httpRoutesService: HttpRoutesService,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService
  ) { }

  public async create(createPermissionInput: CreatePermissionInput): Promise<Permission> {
    const { companyUuid, roleId } = createPermissionInput;

    const role = await this.rolesService.findOne({ companyUuid, id: `${roleId}` });

    if (!role) {
      throw new NotFoundException(`can't get the role ${roleId} for the company with uuid ${companyUuid}.`);
    }

    delete role.company;

    const { httpRouteId } = createPermissionInput;

    const httpRoute = await this.httpRoutesService.findOne({ companyUuid, id: `${httpRouteId}` });

    if (!httpRoute) {
      throw new NotFoundException(`can't get the http route ${httpRouteId} for the company with uuid ${companyUuid}.`);
    }

    const compareTo = await this.permissionRepository.find({
      select: ['id'],
      where: {
        role,
        httpRoute
      }
    });

    if (compareTo.length) {
      throw new HttpException(`already exists a permission for the role ${roleId} and the http route ${httpRouteId}.`, HttpStatus.PRECONDITION_FAILED);
    }

    const { allowed } = createPermissionInput;
    const created = this.permissionRepository.create({
      allowed,
      role,
      httpRoute
    });

    return this.permissionRepository.save(created);
  }

  public async findAll(
    findAllPermissionsParamInput: FindAllPermissionsParamInput,
    findAllPermissionsQueryInput: FindAllPermissionsQueryInput
  ): Promise<Permission[]> {
    const { companyUuid } = findAllPermissionsParamInput;

    const { limit = 0, offset = 0 } = findAllPermissionsQueryInput;

    const query = this.permissionRepository.createQueryBuilder('p')
      .select([
        'p.id as "id"',
        'p.allowed as "allowed"',
        'r.id as "roleId"',
        'r.name as "roleName"',
        'p2.name as "projectName"',
        'hr.id as "httpRouteId"',
        'hr.name as "httpRouteName"'
      ])
      .innerJoin('p.role', 'r')
      .innerJoin('p.httpRoute', 'hr')
      .innerJoin('r.company', 'c')
      .innerJoin('hr.project', 'p2')
      .where('c.uuid = :companyUuid', { companyUuid })
      .take(limit || undefined)
      .skip(offset)
      .orderBy('p.id', 'DESC');

    const data = query.execute();

    return data;
  }

  public async findOne(findOnePermissionInput: FindOnePermissionInput): Promise<Permission | null> {
    const { companyUuid, id } = findOnePermissionInput;

    const existing = await this.permissionRepository.createQueryBuilder('p')
      .innerJoinAndSelect('p.role', 'r')
      .innerJoinAndSelect('p.httpRoute', 'hr')
      .innerJoin('p.role', 'r')
      .innerJoin('r.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('p.id = :id', { id })
      .getOne();

    if (!existing) {
      return null;
    }

    return existing;
  }

  public async update(
    findOnePermissionInput: FindOnePermissionInput,
    updatePermissionInput: UpdatePermissionInput
  ): Promise<Permission> {
    // TODO: improve this code
    const { companyUuid, id } = findOnePermissionInput;

    if (!updatePermissionInput) {
      throw new BadRequestException('updatePermissionInput is empty');
    }

    const { roleId } = updatePermissionInput;

    let role;
    if (roleId) {
      role = await this.rolesService.findOne({ companyUuid, id: `${roleId}` });

      if (!role) {
        throw new NotFoundException(`can't get the role ${roleId} for the company with uuid ${companyUuid}.`);
      }

      delete role.company;
    } else {
      const existing = await this.findOne({ companyUuid, id });

      if (!existing) {
        throw new NotFoundException(`can't get the permission ${id} for the company with uuid ${companyUuid}.`);
      }

      role = existing.role;
    }

    const { httpRouteId } = updatePermissionInput;

    let httpRoute;
    if (httpRouteId) {
      httpRoute = await this.httpRoutesService.findOne({ companyUuid, id: `${httpRouteId}` });

      if (!httpRoute) {
        throw new NotFoundException(`can't get the http route ${httpRouteId} for the company with uuid ${companyUuid}.`);
      }

    } else {
      const existing = await this.findOne({ companyUuid, id });

      if (!existing) {
        throw new NotFoundException(`can't get the permission ${id} for the company with uuid ${companyUuid}.`);
      }

      httpRoute = existing.httpRoute;
    }

    const { allowed } = updatePermissionInput;

    const existing = await this.permissionRepository.preload({
      id: +id,
      allowed,
      role,
      httpRoute
    });

    return this.permissionRepository.save(existing);
  }

  public async remove(findOnePermissionInput: FindOnePermissionInput): Promise<Permission> {
    const existing = await this.findOne(findOnePermissionInput);

    if (!existing) {
      const { id, companyUuid } = findOnePermissionInput;

      throw new NotFoundException(`can't get the permission ${id} for the company with uuid ${companyUuid}.`);
    }

    return this.permissionRepository.remove(existing);
  }

  public async checkPermission(checkPermissionInput: CheckPermissionInput): Promise<CheckPermissionOutput> {
    const { companyUuid, projectCode } = checkPermissionInput;

    const project = await this.projectsService.getProjectByCompanyAndCode({ companyUuid, code: projectCode });

    if (!project) {
      return {
        allowed: false,
        reason: `can't get a project for the company ${companyUuid} and code ${projectCode}.`
      };
    };

    const { token } = checkPermissionInput;

    const user = await this.usersService.getUserByToken({ companyUuid, token });

    const httpRoutesForUser = await this.httpRoutesService.getUserRoutes({ userId: user.id });

    if (!httpRoutesForUser.length) {
      return {
        allowed: false,
        reason: 'the user does not have assigned routes.'
      };
    }

    // try to get the allowed route
    const opts = {
      strict: true,
      sensitive: true,
      end: true,
      decode: decodeURIComponent
    };

    const { requestedMethod, requestedRoute = 'get' } = checkPermissionInput;

    let allowedRoute;

    if (requestedMethod && requestedRoute) {
      for (const httpRoute of httpRoutesForUser) {
        const keys = [];
        const regexp = pathToRegexp(httpRoute.path, keys, opts);

        const result = regexp.exec(requestedRoute);
        if (result && httpRoute.method.toLowerCase() === requestedMethod.toLowerCase()) {
          allowedRoute = httpRoute;
          break;
        }
      }
    }

    if (!allowedRoute) {
      return {
        allowed: false,
        reason: 'the user does not have this routed as assigned.'
      };
    }

    return {
      allowed: true,
      reason: 'so far, so good.'
    };
  }
}
