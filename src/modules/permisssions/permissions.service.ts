import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from './permission.entity';

import { HttpRoutesService } from '../http-routes/http-routes.service';
import { RolesService } from '../roles/roles.service';

import { CreatePermissionInput } from './dto/create-permission-input.dto';
import { FindAllPermissionsParamInput } from './dto/find-all-permissions-param-input.dto';
import { FindAllPermissionsQueryInput } from './dto/find-all-permissions-query-input.dto';
import { FindOnePermissionInput } from './dto/find-one-permission-input.dto';
import { UpdatePermissionInput } from './dto/update-permission-input.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly rolesService: RolesService,
    private readonly httpRoutesService: HttpRoutesService
  ) {}

  public async create(createPermissionInput: CreatePermissionInput): Promise<Permission> {
    const { companyUuid, roleId } = createPermissionInput;

    const role = await this.rolesService.findOne({ companyUuid, id:  `${roleId}` });

    delete role.company;

    const { httpRouteId } = createPermissionInput;

    const httpRoute = await this.httpRoutesService.findOne({ companyUuid, id: `${httpRouteId}` });

    const compareTo = await this.permissionRepository.find({
      select: [ 'id' ],
      where: {
        role,
        httpRoute
      }
    });

    if (compareTo.length) {
      throw new HttpException(`already exists a permission for the role ${roleId} and the http route ${httpRouteId}.`,HttpStatus.PRECONDITION_FAILED);
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

  public async findOne(findOnePermissionInput: FindOnePermissionInput): Promise<Permission> {
    const { companyUuid, id } = findOnePermissionInput;

    const count = await this.permissionRepository.createQueryBuilder('p')
      .select(['p.id as "id"'])
      .innerJoin('p.role', 'r')
      .innerJoin('r.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('p.id = :id', { id })
      .getCount();

    if (!count) {
      throw new NotFoundException(`can not get the  httpe route ${id} for the company with uuid ${companyUuid}`);
    }

    const existing = await this.permissionRepository.findOne(id, {
      relations: ['role', 'httpRoute']
    });

    return existing;
  }

  public async update(
    findOnePermissionInput: FindOnePermissionInput,
    updatePermissionInput: UpdatePermissionInput
  ): Promise<Permission> {
    const { companyUuid, id } = findOnePermissionInput;

    if (!updatePermissionInput) {
      throw new BadRequestException('updatePermissionInput is empty');
    }

    const { roleId } = updatePermissionInput;

    let role;
    if (roleId) {      
      role = await this.rolesService.findOne({ companyUuid, id: `${roleId}` });
      delete role.company;
    } else {
      const existing = await this.findOne({ companyUuid, id });
      role = existing.role;
    }

    const { httpRouteId } = updatePermissionInput;

    let httpRoute;
    if (httpRouteId) {
      httpRoute = await this.httpRoutesService.findOne({ companyUuid, id: `${httpRouteId}` });
    } else {
      const existing = await this.findOne({ companyUuid, id });
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

    return this.permissionRepository.remove(existing);
  }
}
