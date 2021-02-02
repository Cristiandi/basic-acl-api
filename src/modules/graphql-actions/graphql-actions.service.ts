import { Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GraphqlAction } from './graphql-action.entity';

import { ProjectsService } from '../projects/projects.service';

import { CreateInput } from './dto/create-input.dto';
import { FindOneInput } from './dto/find-one-input.dto';
import { ListParamInput } from './dto/list-param-input.dto';
import { ListQueryInput } from './dto/list-query-input.dto';
import { UpdateInput } from './dto/update-input.dto';

@Injectable()
export class GraphqlActionsService {
  constructor(
    @InjectRepository(GraphqlAction)
    private readonly graphqlActionRepository: Repository<GraphqlAction>,
    private readonly projectsService: ProjectsService
  ) {}

  /**
   *
   *
   * @param {CreateInput} createInput
   * @return {*}  {Promise<GraphqlAction>}
   * @memberof GraphqlActionsService
   */
  public async create(createInput: CreateInput): Promise<GraphqlAction> {
    const { projectId, companyUuid } = createInput;

    const existingProject = await this.projectsService.findOne({ id: '' + projectId, companyUuid });

    if (!existingProject) {
      throw new NotFoundException(`can't get the project ${projectId} for the company with uuid ${companyUuid}.`);
    }

    const { name } = createInput;

    const existingItem = await this.graphqlActionRepository.createQueryBuilder('ga')
      .where('ga.project_id = :projectId', { projectId })
      .andWhere('ga.name = :name', { name })
      .getOne();

    if (existingItem) {
      throw new PreconditionFailedException('the graphql action already exists.');
    }

    const { isMutation = false, isQuery = false } = createInput;

    if (isMutation === isQuery) {
      throw new PreconditionFailedException('isMutation and isQuery can not have the same value.');
    }

    const created = this.graphqlActionRepository.create({
      isMutation,
      isQuery,
      name,
      project: existingProject
    });

    const saved = await this.graphqlActionRepository.save(created);

    return saved;
  }

  /**
   *
   *
   * @param {FindOneInput} findOneInput
   * @return {*}  {(Promise<GraphqlAction | null>)}
   * @memberof GraphqlActionsService
   */
  public async findOne(findOneInput: FindOneInput): Promise<GraphqlAction | null> {
    const { companyUuid, id } = findOneInput;

    const count = await this.graphqlActionRepository.createQueryBuilder('ga')
      .select(['ga.id as "id"'])
      .innerJoin('hr.project', 'p')
      .innerJoin('p.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('ga.id = :id', { id })
      .getCount();

    if (!count) return null;

    const existing = await this.graphqlActionRepository.createQueryBuilder('ga')
      .innerJoinAndSelect('ga.project', 'p')
      .where('ga.id = :id', { id })
      .getOne();

    return existing;
  }

  /**
   *
   *
   * @param {ListParamInput} listParamInput
   * @param {ListQueryInput} listQueryInput
   * @return {*}  {Promise<GraphqlAction[]>}
   * @memberof GraphqlActionsService
   */
  public async list(listParamInput: ListParamInput, listQueryInput: ListQueryInput): Promise<GraphqlAction[]> {
    const { companyUuid } = listParamInput;

    const { limit = 0, offset = 0 } = listQueryInput;

    const data = await this.graphqlActionRepository.createQueryBuilder('ga')
      .select([
        'ga.id as "id"',
        'ga.is_query as "isQuery"',
        'ga.is_mutation as "isMutation"',
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

  /**
   *
   *
   * @param {FindOneInput} findOneInput
   * @param {*} updateInput
   * @memberof GraphqlActionsService
   */
  public async update(findOneInput: FindOneInput, updateInput: UpdateInput): Promise<GraphqlAction> {
    const { id } = findOneInput;
    const { projectId } = updateInput;

    let project;

    if (projectId) {
      const { companyUuid } = findOneInput;
      project = await this.projectsService.findOne({ companyUuid, id: `${projectId}` });

      if (!project) {
        throw new NotFoundException(`can't get the project ${projectId} for the compant with uuid ${companyUuid}.`);
      }

      delete project.company;
    } else {
      const { companyUuid } = findOneInput;
      const existing = await this.findOne({ companyUuid, id });

      if (!existing) {
        throw new NotFoundException(`can't get the graphql action ${id} for the company with uuid ${companyUuid}.`);
      }

      project = existing.project;
    }

    const { name, isQuery, isMutation } = updateInput;

    const existing = await this.graphqlActionRepository.preload({
      id: +id,
      name,
      isMutation,
      isQuery,
      project
    });

    if (!existing) {
      throw new NotFoundException(`graphql action ${id} not found.`);
    }

    const compareTo = await this.graphqlActionRepository.find({
      where: {
        project,
        name
      }
    });

    if (compareTo.length) {
      const [graphqlToCompare] = compareTo;

      if (graphqlToCompare.id !== existing.id) {
        throw new PreconditionFailedException('other graphql action already exists for the project.');
      }
    }

    const updated = await this.graphqlActionRepository.save(existing);

    return updated;
  }

  public async delete(findOneInput: FindOneInput): Promise<GraphqlAction> {
    const existingItem = await this.findOne(findOneInput);

    if (!existingItem) {
      const { id, companyUuid } = findOneInput;
      throw new NotFoundException(`can't get the graphql action ${id} for the company ${companyUuid}.`);
    }

    const removed = await this.graphqlActionRepository.remove(existingItem);

    delete removed.project;

    return removed;
  }
}
