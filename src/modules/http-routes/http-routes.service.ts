import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HttpRoute } from './http-route.entity';

import { ProjectsService } from '../projects/projects.service';

import { CreateHttpRouteInput } from './dto/create-http-route-input.dto';
import { FindAllHttpRoutesParamInput } from './dto/find-all-http-routes-param-input.dto';
import { FindAllHttpRoutesQueryInput } from './dto/find-all-http-routes-query-input-dto';
import { FindOneHttpRouteInput } from './dto/find-one-http-route-input.dto';
import { UpdateHttpRouteInput } from './dto/update-http-route-input.dto';
import { GetUserRoutesInput } from './dto/get-user-routes-input.dto';

@Injectable()
export class HttpRoutesService {
  constructor(
    @InjectRepository(HttpRoute)
    private readonly httpRouteRepository: Repository<HttpRoute>,
    private readonly projectsService: ProjectsService
  ) { }

  public async create(createHttpRouteInput: CreateHttpRouteInput): Promise<HttpRoute> {
    const { companyUuid, projectId } = createHttpRouteInput;

    const project = await this.projectsService.findOne({ companyUuid, id: `${projectId}` });

    if (!project) {
      throw new NotFoundException(`can't get the project ${projectId} for the compant with uuid ${companyUuid}.`);
    }

    delete project.company;

    const { method, path } = createHttpRouteInput;

    const existing = await this.httpRouteRepository.find({
      select: ['id'],
      where: {
        method,
        path,
        project
      }
    });

    if (existing.length) {
      throw new HttpException('http route already exists for method, path and project.', HttpStatus.PRECONDITION_FAILED);
    }

    const { name } = createHttpRouteInput;

    const created = this.httpRouteRepository.create({
      name,
      method,
      path,
      project
    });

    return this.httpRouteRepository.save(created);
  }

  public async findAll(
    findAllHttpRoutesParamInput: FindAllHttpRoutesParamInput,
    findAllHttpRoutesQueryInput: FindAllHttpRoutesQueryInput
  ): Promise<HttpRoute[]> {
    const { companyUuid } = findAllHttpRoutesParamInput;

    const { limit = 0, offset = 0 } = findAllHttpRoutesQueryInput;

    const data = await this.httpRouteRepository.createQueryBuilder('hr')
      .select([
        'hr.id as "id"',
        'hr.name as "name"',
        'hr.method as "method"',
        'hr.path as "path"',
        'p.id as "projectId"',
        'p.name as "projectName"'
      ])
      .innerJoin('hr.project', 'p')
      .innerJoin('p.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .take(limit || undefined)
      .skip(offset)
      .orderBy('hr.id', 'DESC')
      .execute();

    return data;
  }

  public async findOne(findOneHttpRouteInput: FindOneHttpRouteInput): Promise<HttpRoute | null> {
    const { companyUuid, id } = findOneHttpRouteInput;

    const existing = await this.httpRouteRepository.createQueryBuilder('hr')
      .innerJoinAndSelect('hr.project', 'p')
      .innerJoin('p.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('hr.id = :id', { id })
      .getOne();

    if (!existing) {
      return null;
    }

    return existing;
  }

  public async update(
    findOneHttpRouteInput: FindOneHttpRouteInput,
    updateHttpRouteInput: UpdateHttpRouteInput
  ): Promise<HttpRoute> {
    const { id } = findOneHttpRouteInput;
    const { projectId } = updateHttpRouteInput;

    let project;

    if (projectId) {
      const { companyUuid } = findOneHttpRouteInput;
      project = await this.projectsService.findOne({ companyUuid, id: `${projectId}` });

      if (!project) {
        throw new NotFoundException(`can not get the project ${projectId} for the company with uuid ${companyUuid}`);
      }

      delete project.company;
    } else {
      const { companyUuid } = findOneHttpRouteInput;
      const existing = await this.findOne({ companyUuid, id });

      if (!existing) {
        throw new NotFoundException(`can not get the  httpe route ${id} for the company with uuid ${companyUuid}`);
      }

      project = existing.project;
    }

    const { name, method, path } = updateHttpRouteInput;

    const existing = await this.httpRouteRepository.preload({
      id: +id,
      name,
      method,
      path,
      project
    });

    if (!existing) {
      throw new NotFoundException(`http route ${id} not found.`);
    }

    const compareTo = await this.httpRouteRepository.find({
      where: {
        method: existing.method,
        path: existing.path,
        project: existing.project
      }
    });

    if (compareTo.length) {
      const [httpRouteToCompare] = compareTo;

      if (httpRouteToCompare.id !== existing.id) {
        throw new HttpException('other http route already exists for the method, path or the project.', 412);
      }
    }

    return this.httpRouteRepository.save(existing);
  }

  public async remove(findOneHttpRouteInput: FindOneHttpRouteInput): Promise<HttpRoute> {
    const existing = await this.findOne(findOneHttpRouteInput);

    if (!existing) {
      const { id, companyUuid } = findOneHttpRouteInput;
      throw new NotFoundException(`can not get the  httpe route ${id} for the company with uuid ${companyUuid}`);
    }

    const removed = await this.httpRouteRepository.remove(existing);

    delete removed.project.company;

    return removed;
  }

  public async getUserRoutes(getUserRoutesInput: GetUserRoutesInput): Promise<HttpRoute[]> {
    const { userId } = getUserRoutesInput;

    const query = this.httpRouteRepository.createQueryBuilder('hr')
      .innerJoin('hr.permissions', 'p')
      .innerJoin('p.role', 'r')
      .innerJoin('r.assignedRoles', 'ar')
      .innerJoin('ar.user', 'u')
      .where('u.id = :userId', { userId })
      .orderBy('hr.path', 'DESC');

    return query.getMany();
  }
}
