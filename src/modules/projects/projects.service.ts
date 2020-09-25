import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from './project.entity';

import { CompaniesService } from '../companies/companies.service';

import { CreateProjectInput } from './dto/create-project-input.dto';
import { FindAllProjectsParamInput } from './dto/find-all-projects-param-input.dto';
import { FindAllProjectsQueryInput } from './dto/find-all-projects-query-input.dto';
import { FindOneProjectInput } from './dto/find-one-project-input.dto';
import { UpdateProjectInput } from './dto/update-project-input.dto';
import { GetProjectByCompanyAndCodeInput } from './dto/get-project-by-company-and-code-input.dto';

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

    /**
     * function to find one project
     *
     * @param {FindOneProjectInput} findOneProjectInput
     * @returns {Promise<Project>}
     * @memberof ProjectsService
     */
    public async findOne(findOneProjectInput: FindOneProjectInput): Promise<Project> {
        const { companyUuid } = findOneProjectInput;

        const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

        if (!company) {
            throw new NotFoundException(`can not get the company with uuid ${companyUuid}.`);
        }

        const { id } = findOneProjectInput;
        const existing = await this.projectRepository.findOne(id, {
            where: {
                company
            },
            relations: ['company']
        });

        if (!existing) {
            throw new NotFoundException(`project ${id} not found`);
        }

        return existing;
    }

    /**
     * function to update a project
     *
     * @param {FindOneProjectInput} findOneProjectInput
     * @param {UpdateProjectInput} updateProjectInput
     * @return {*}  {Promise<Project>}
     * @memberof ProjectsService
     */
    public async update(
        findOneProjectInput: FindOneProjectInput,
        updateProjectInput: UpdateProjectInput
    ): Promise<Project> {
        const { id, companyUuid } = findOneProjectInput;

        const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

        if (!company) {
            throw new NotFoundException(`can't get the company with uuid ${companyUuid}`);
        }

        const existing = await this.projectRepository.preload({
            id: +id,
            company,
            ...updateProjectInput
        });

        if (!existing) {
            throw new NotFoundException(`project ${id} not found.`);
        }

        const compareTo = await this.projectRepository.find({
            where: {
                company: existing.company,
                code: existing.code
            }
        });

        if (compareTo.length) {
            const [projectToCompare] = compareTo;

            if (projectToCompare.id !== existing.id) {
                throw new HttpException('other project already exists for the company or code.', 412);
              }
        }

        const saved = await this.projectRepository.save(existing);

        delete saved.company;

        return saved;
    }

    /**
     * function to delete a project company
     *
     * @param {FindOneProjectInput} findOneProjectInput
     * @return {*}  {Promise<Project>}
     * @memberof ProjectsService
     */
    public async remove(findOneProjectInput: FindOneProjectInput): Promise<Project> {
        const existing = await this.findOne(findOneProjectInput);

        const removed = await this.projectRepository.remove(existing);

        delete removed.company;

        return removed;
    }

    public async getProjectByCompanyAndCode(getProjectByCompanyAndCodeInput: GetProjectByCompanyAndCodeInput): Promise<Project> {
        const { companyUuid, code } = getProjectByCompanyAndCodeInput;

        const query = this.projectRepository.createQueryBuilder('p')
        .innerJoin('p.company', 'c')
        .where('c.uuid = :companyUuid', { companyUuid })
        .andWhere('p.code = :code', { code });

        const existing = await query.getOne();

        return existing;
    }
}
