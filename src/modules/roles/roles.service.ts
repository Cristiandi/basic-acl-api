import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from './role.entity';

import { CompaniesService } from '../companies/companies.service';

import { CreateRoleInput } from './dto/create-role-input.dto';
import { FindAllRolesParamInput } from './dto/find-all-roles-param-input.dto';
import { FindAllRolesQueryInput } from './dto/find-all-roles-query-input.dto';
import { FindOneRoleInput } from './dto/find-one-role-input.dto';
import { UpdateRoleInput } from './dto/update-role-input.dto';
import { GetCompanyRoleByCodeInput } from './dto/get-company-role-by-code-input.dto';

@Injectable()
export class RolesService {
  constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly companiesService: CompaniesService
  ) { }

  /**
     * funciton to create a role for a company
     *
     * @param {CreateRoleInput} createRoleInput
     * @return {*}  {Promise<Role>}
     * @memberof RolesService
     */
  public async create(createRoleInput: CreateRoleInput): Promise<Role> {
    const { companyUuid } = createRoleInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can not get the company with uuid ${company}`);
    }

    const { code } = createRoleInput;

    const compareTo = await this.roleRepository.find({
      where: {
        company,
        code
      }
    });

    if (compareTo.length) {
      throw new HttpException(`already exists a role for the company ${companyUuid} and code ${code}.`, 412);
    }

    const { name } = createRoleInput;

    const created = this.roleRepository.create({
      code,
      name,
      company
    });

    const saved = await this.roleRepository.save(created);

    delete saved.company;

    return saved;
  }

  /**
     * function to get all the roles of a company
     *
     * @param {FindAllRolesParamInput} findAllRolesParamInput
     * @param {FindAllRolesQueryInput} findAllRolesQueryInput
     * @return {*}  {Promise<Role[]>}
     * @memberof RolesService
     */
  public async findAll(
    findAllRolesParamInput: FindAllRolesParamInput,
    findAllRolesQueryInput: FindAllRolesQueryInput
  ): Promise<Role[]> {
    const { companyUuid } = findAllRolesParamInput;
    const { limit = 0, offset = 0 } = findAllRolesQueryInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can not get the company with uuid ${company}`);
    }

    return this.roleRepository.find({
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
     * function to get one role
     *
     * @param {FindOneRoleInput} findOneRoleInput
     * @return {*}  {Promise<Role>}
     * @memberof RolesService
     */
  public async findOne(findOneRoleInput: FindOneRoleInput): Promise<Role> {
    const { companyUuid, id } = findOneRoleInput;

    const existing = await this.roleRepository.createQueryBuilder('r')
      .innerJoinAndSelect('r.company', 'c')
      .where('r.id = :id', { id })
      .andWhere('c.uuid = :companyUuid', { companyUuid })
      .getOne();

    if (!existing) {
      return null;
    }

    return existing;
  }

  /**
     * function to update a role
     *
     * @param {FindOneRoleInput} findOneRoleInput
     * @param {UpdateRoleInput} updateRoleInput
     * @return {*}  {Promise<Role>}
     * @memberof RolesService
     */
  public async update(
    findOneRoleInput: FindOneRoleInput,
    updateRoleInput: UpdateRoleInput
  ): Promise<Role> {
    const { id, companyUuid } = findOneRoleInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can't get the company with uuid ${companyUuid}`);
    }

    const existing = await this.roleRepository.preload({
      id: +id,
      company,
      ...updateRoleInput
    });

    if (!existing) {
      throw new NotFoundException(`role ${id} not found.`);
    }

    const compareTo = await this.roleRepository.find({
      where: {
        company: existing.company,
        code: existing.code
      }
    });

    if (compareTo.length) {
      const [roleToCompare] = compareTo;

      if (roleToCompare.id !== existing.id) {
        throw new HttpException('other role already exists for the company or code.', 412);
      }
    }

    const saved = await this.roleRepository.save(existing);

    delete saved.company;

    return saved;
  }


  /**
     * function to remove a roie
     *
     * @param {FindOneRoleInput} findOneRoleInput
     * @return {*}  {Promise<Role>}
     * @memberof RolesService
     */
  public async remove(findOneRoleInput: FindOneRoleInput): Promise<Role> {
    const existing = await this.findOne(findOneRoleInput);

    if (!existing) {
      const { id, companyUuid } = findOneRoleInput;
      throw new NotFoundException(`can't get the role ${id} for the company with uuid ${companyUuid}.`);
    }

    const removed = await this.roleRepository.remove(existing);

    delete removed.company;

    return removed;
  }

  /**
     *
     *
     * @param {GetCompanyRoleByCodeInput} getCompanyRoleByCodeInput
     * @return {*}  {Promise<Role>}
     * @memberof RolesService
     */
  public async getCompanyRoleByCode(getCompanyRoleByCodeInput: GetCompanyRoleByCodeInput): Promise<Role | null> {
    const { companyUuid, code } = getCompanyRoleByCodeInput;

    const role = await this.roleRepository.createQueryBuilder('r')
      .innerJoin('r.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('r.code = :code', { code })
      .getOne();

    if (!role) {
      return null;
    }

    return role;
  }
}
