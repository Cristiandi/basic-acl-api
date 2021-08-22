import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../common/base.service';

import { Project } from './project.entity';

import { CompanyService } from '../company/services/company.service';

import { CreateProjectInput } from './dto/create-project-input.dto';
import { GetOneProjectInput } from './dto/get-one-project-input.dto';
import { GetAllProjectsInput } from './dto/get-all-projects-input.dto';
import { UpdateProjectInput } from './dto/update-project-input.dto';
@Injectable()
export class ProjectService extends BaseService<Project> {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly companyService: CompanyService,
  ) {
    super(projectRepository);
  }

  // CRUD

  public async create(input: CreateProjectInput): Promise<Project> {
    const { companyUid } = input;

    const company = await this.companyService.getOne({
      uid: companyUid,
    });

    if (!company) {
      throw new NotFoundException(`company with uid ${companyUid} not found.`);
    }

    const { code } = input;

    const existing = await this.getOneByOneFields({
      fields: { company, code },
    });

    if (existing) {
      throw new ConflictException(`project with code ${code} already exists.`);
    }

    const created = this.projectRepository.create({
      ...input,
      company,
    });

    const saved = await this.projectRepository.save(created);

    return saved;
  }

  public async getOne(input: GetOneProjectInput): Promise<Project | undefined> {
    const { uid } = input;

    const existing = await this.getOneByOneFields({
      fields: { uid },
      checkIfExists: false,
    });

    return existing;
  }

  public async getAll(input: GetAllProjectsInput): Promise<Project[]> {
    console.log('inpit', input);

    const { companyUid, limit, skip, q } = input;

    const query = this.projectRepository
      .createQueryBuilder('project')
      .loadAllRelationIds()
      .innerJoin('project.company', 'company')
      .where('company.uid = :companyUid', { companyUid });

    if (q)
      query.andWhere(
        'project.code ilike :q OR project.name ilike :q OR project.description ilike :q',
        {
          q: `%${q}%`,
        },
      );

    query.limit(limit || 10).skip(skip);

    const items = await query.getMany();

    return items;
  }

  public async update(
    getOneProjectInput: GetOneProjectInput,
    input: UpdateProjectInput,
  ): Promise<Project> {
    const { uid } = getOneProjectInput;

    const existing = await this.getOneByOneFields({
      fields: { uid },
      checkIfExists: true,
    });

    const preloaded = await this.projectRepository.preload({
      id: existing.id,
      ...input,
    });

    const saved = await this.projectRepository.save(preloaded);

    return {
      ...existing,
      ...saved,
    } as Project;
  }

  public async delete(input: GetOneProjectInput): Promise<Project> {
    const { uid } = input;

    const existing = await this.getOneByOneFields({
      fields: { uid },
      checkIfExists: true,
    });

    const clone = { ...existing };

    await this.projectRepository.softRemove(existing);

    return clone as Project;
  }

  // CRUD
}
