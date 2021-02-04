import { Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { pathToRegexp } from 'path-to-regexp';

import { Permission } from './permission.entity';

import { HttpRoutesService } from '../http-routes/http-routes.service';
import { RolesService } from '../roles/roles.service';
import { GraphqlActionsService } from '../graphql-actions/graphql-actions.service';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';

import { CreatePermissionInput } from './dto/create-permission-input.dto';
import { FindAllPermissionsParamInput } from './dto/find-all-permissions-param-input.dto';
import { FindAllPermissionsQueryInput } from './dto/find-all-permissions-query-input.dto';
import { FindOnePermissionInput } from './dto/find-one-permission-input.dto';
import { UpdatePermissionInput } from './dto/update-permission-input.dto';
import { CheckPermissionInput } from './dto/check-permission-input.dto';
import { CheckPermissionOutput } from './dto/check-permission-output.dto';
import { CheckPermissionGraphqlInput } from './dto/check-permission-graphql-input.dto';
import { CheckPermissionGraphqlOutput } from './dto/check-permission-graphql.-output.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly rolesService: RolesService,
    private readonly httpRoutesService: HttpRoutesService,
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
    private readonly graphqlActionsService: GraphqlActionsService
  ) { }

  public async create(createPermissionInput: CreatePermissionInput): Promise<Permission> {
    const { companyUuid, roleId } = createPermissionInput;

    const role = await this.rolesService.findOne({ companyUuid, id: `${roleId}` });

    if (!role) {
      throw new NotFoundException(`can't get the role ${roleId} for the company with uuid ${companyUuid}.`);
    }

    delete role.company;

    const { httpRouteId = null, graphqlActionId = null } = createPermissionInput;

    if (!httpRouteId && !graphqlActionId) {
      throw new PreconditionFailedException('at leat httpRouteId or graphqlActionId needs to have a value.');
    }

    if (httpRouteId && graphqlActionId) {
      throw new PreconditionFailedException('httpRouteId and graphqlActionId can\'t have value at same time.');
    }

    let httpRoute = null;

    if (httpRouteId) {
      httpRoute = await this.httpRoutesService.findOne({ companyUuid, id: `${httpRouteId}` });

      if (!httpRoute) {
        throw new NotFoundException(`can't get the http route ${httpRouteId} for the company with uuid ${companyUuid}.`);
      }
    }

    let graphqlAction = null;

    if (graphqlActionId) {
      graphqlAction = await this.graphqlActionsService.findOne({ companyUuid, id: '' + graphqlActionId });

      if (!graphqlAction) {
        throw new NotFoundException(`can't get the graphql action ${graphqlActionId} for the company with uuid ${companyUuid}.`);
      }
    }

    const existing = await this.permissionRepository.findOne({
      select: ['id'],
      where: {
        role,
        httpRoute,
        graphqlAction
      }
    });

    if (existing) {
      throw new PreconditionFailedException(`already exists a permission for the role ${roleId}, the http route ${httpRouteId} and graphql action ${graphqlActionId}.`);
    }

    const { allowed } = createPermissionInput;
    const created = this.permissionRepository.create({
      allowed,
      role,
      httpRoute,
      graphqlAction
    });

    const saved = this.permissionRepository.save(created);

    return saved;
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
        'p2.name as "httpRouteProject"',
        'hr.id as "httpRouteId"',
        'hr.name as "httpRouteName"',
        'p3.name as "graphqlActionProject"',
        'ga.id as "graphqlActionId"',
        'ga.name as "graphqlActionName"'
      ])
      .innerJoin('p.role', 'r')
      .innerJoin('r.company', 'c')
      .leftJoin('p.httpRoute', 'hr')
      .leftJoin('hr.project', 'p2')
      .leftJoin('p.graphqlAction', 'ga')
      .leftJoin('ga.project', 'p3')
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
      .innerJoin('r.company', 'c')
      .leftJoinAndSelect('p.httpRoute', 'hr')
      .leftJoinAndSelect('p.graphqlAction', 'ga')
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

    const existing = await this.findOne({ companyUuid, id });

    if (!existing) {
      throw new NotFoundException(`can't get the permission ${id} for the company with uuid ${companyUuid}.`);
    }

    if (!updatePermissionInput) {
      return existing;
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
      httpRoute = existing.httpRoute;
    }

    const { graphqlActionId } = updatePermissionInput;
    
    let graphqlAction;
    if (graphqlActionId) {
      graphqlAction = await this.graphqlActionsService.findOne({ companyUuid, id: '' + graphqlActionId });

      if (!graphqlAction) {
        throw new NotFoundException(`can't get the graphql action ${graphqlActionId} for the company with uuid ${companyUuid}.`);
      }
    }

    const { allowed } = updatePermissionInput;

    const preloaded = await this.permissionRepository.preload({
      id: existing.id,
      allowed,
      role,
      httpRoute,
      graphqlAction
    });

    const saved = await this.permissionRepository.save(preloaded);

    return saved;
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
        reason: 'the user does not have this routed as assigned and allowed.'
      };
    }

    return {
      allowed: true,
      reason: 'so far, so good.'
    };
  }

  /**
   *
   *
   * @param {CheckPermissionGraphqlInput} checkPermissionGraphqlInput
   * @return {*}  {Promise<CheckPermissionGraphqlOutput>}
   * @memberof PermissionsService
   */
  public async checkPermissionGraphql(checkPermissionGraphqlInput: CheckPermissionGraphqlInput) : Promise<CheckPermissionGraphqlOutput>{
    const { companyUuid, projectCode } = checkPermissionGraphqlInput;

    const project = await this.projectsService.getProjectByCompanyAndCode({ companyUuid, code: projectCode });

    if (!project) {
      return {
        allowed: false,
        reason: `can't get a project for the company ${companyUuid} and code ${projectCode}.`
      };
    };

    const { graphqlActionName } = checkPermissionGraphqlInput;

    const graphqlAction = await this.graphqlActionsService.getByNameAndProject({
      name: graphqlActionName,
      projectId: project.id
    });

    if (!graphqlAction) {
      return {
        allowed: false,
        reason: `can't get a graphql action with name ${graphqlActionName} and for the project with code ${projectCode}.`
      };
    }

    const { token } = checkPermissionGraphqlInput;

    const user = await this.usersService.getUserByToken({ companyUuid, token });

    const permission = await this.permissionRepository.createQueryBuilder('p')
      .innerJoin('p.graphqlAction', 'ga')
      .innerJoin('p.role', 'r')
      .innerJoin('r.assignedRoles', 'ar')
      .innerJoin('ar.user', 'u')
      .where('u.id = :userId', { userId: user.id })
      .andWhere('ga.id = :graphqlActionId', { graphqlActionId: graphqlAction.id })
      .andWhere('p.allowed = true')
      .getOne();

    if (!permission) {
      return {
        allowed: false,
        reason: 'the user does not have this graphql action as assigned and allowed.'
      };
    }

    return {
      allowed: true,
      reason: 'so far, so good.'
    };
  }
}
