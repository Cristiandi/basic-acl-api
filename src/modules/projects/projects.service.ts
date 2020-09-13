import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from './project.entity';

import { CompaniesService } from '../companies/companies.service';

import { CreateProjectInput } from './dto/create-project-input.dto';
import { FindAllProjectsParamInput } from './dto/find-all-projects-param-input.dto';
import { FindAllProjectsQueryInput } from './dto/find-all-projects-query-input.dto';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private readonly companiesService: CompaniesService
    ) { }


    /**
     * funciton to create a project
     *
     * @param {CreateProjectInput} createProjectInput
     * @return {*}  {Promise<Project>}
     * @memberof ProjectsService
     */
    public async create(createProjectInput: CreateProjectInput): Promise<Project> {
        const { companyUuid } = createProjectInput;

        const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

        if (!company) {
            throw new NotFoundException(`can not get the company with uuid ${company}`);
        }

        const { code } = createProjectInput;

        const compareTo = await this.projectRepository.find({
            where: {
                company,
                code
            }
        });

        if (compareTo.length) {
            throw new HttpException(`already exists a project for the company ${companyUuid} and code ${code}.`, 412);
        }

        const { name } = createProjectInput;

        const created = this.projectRepository.create({
            code,
            name,
            company
        });

        const saved = await this.projectRepository.save(created);

        delete saved.company;

        return saved;
    }

    /**
     * function to get all the projects of a company
     *
     * @param {FindAllProjectsParamInput} findAllProjectsParamInput
     * @param {FindAllProjectsQueryInput} findAllProjectsQueryInput
     * @return {*}  {Promise<Project[]>}
     * @memberof ProjectsService
     */
    public async findAll(
        findAllProjectsParamInput: FindAllProjectsParamInput,
        findAllProjectsQueryInput: FindAllProjectsQueryInput
    ): Promise<Project[]> {
        const { companyUuid } = findAllProjectsParamInput;
        const { limit = 0, offset = 0 } = findAllProjectsQueryInput;

        const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

        if (!company) {
            throw new NotFoundException(`can not get the company with uuid ${company}`);
        }

        return this.projectRepository.find({
            select: ['id', 'name', 'code', 'createdAt', 'updatedAt'],
            where: {
                company
            },
            take: limit || undefined,
            skip: offset,
            order: {
                id: 'DESC'
            }
        });
    }
}
