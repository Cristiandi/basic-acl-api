import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from 'src/common/base.service';

import { Project } from './project.entity';

import { CreateProjectInput } from './dto/create-project-input.dto';
import { CompanyService } from '../company/company.service';
@Injectable()
export class ProjectService extends BaseService<Project> {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly companyService: CompanyService,
  ) {
    super(projectRepository);
  }

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
      checkIfExists: true,
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
}
