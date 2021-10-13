import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { BaseService } from '../../../common/base.service';

import { Company } from '../company.entity';

import { generateUid } from '../../../utils';

import { CreateCompanyInput } from '../dto/create-company-input.dto';
import { GetOneCompanyInput } from '../dto/get-one-company-input.dto';
import { UpdateCompanyInput } from '../dto/update-company-input.dto';
@Injectable()
export class CompanyService extends BaseService<Company> {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {
    super(companyRepository);
  }

  // CRUD

  public async create(input: CreateCompanyInput): Promise<Company> {
    const { name, firebaseAdminConfig, firebaseConfig } = input;

    const existingByName = await this.getOneByOneFields({
      fields: { name },
      checkIfExists: false,
    });

    if (existingByName) {
      throw new ConflictException(
        `already exists the company with name ${name}.`,
      );
    }

    const accessKey = generateUid(20);

    const created = this.companyRepository.create({
      name,
      accessKey,
      firebaseAdminConfig,
      firebaseConfig,
    });

    const saved = await this.companyRepository.save(created);

    delete saved.firebaseAdminConfig;
    delete saved.firebaseConfig;

    return saved;
  }

  public async getOne(
    getOneCompanyInput: GetOneCompanyInput,
  ): Promise<Company | undefined> {
    const { uid } = getOneCompanyInput;

    const existing = await this.getOneByOneFields({
      fields: { uid },
      checkIfExists: false,
    });

    return existing;
  }

  public async update(
    getOneCompanyInput: GetOneCompanyInput,
    updateCompanyInput: UpdateCompanyInput,
  ): Promise<Company> {
    const existing = await this.getOne(getOneCompanyInput);

    if (!existing) {
      throw new NotFoundException(`can't get the company.`);
    }

    const { name } = updateCompanyInput;

    const otherExisting = await this.companyRepository.findOne({
      where: {
        name,
        id: Not(existing.id),
      },
    });

    if (otherExisting) {
      throw new ConflictException(`the name is being used for other company`);
    }

    const preloaded = await this.companyRepository.preload({
      id: existing.id,
      ...updateCompanyInput,
    });

    const saved = await this.companyRepository.save(preloaded);

    return saved;
  }

  public async delete(
    getOneCompanyInput: GetOneCompanyInput,
  ): Promise<Company> {
    const existing = await this.getOne(getOneCompanyInput);

    if (!existing) {
      throw new NotFoundException(`can't get the company.`);
    }

    const clone = { ...existing };

    await this.companyRepository.softRemove(existing);

    delete clone.firebaseAdminConfig;
    delete clone.firebaseConfig;

    return clone as Company;
  }

  // CRUD

  public async getByIds(ids: number[]): Promise<Company[]> {
    return this.companyRepository.findByIds(ids, {
      loadRelationIds: true,
    });
  }

  public async roles(parent: Company): Promise<any[]> {
    const { id } = parent;

    const master = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.roles', 'role')
      .where('company.id = :id', { id })
      .getOne();

    const items = master ? master.roles : [];

    return items.map((item) => ({ ...item, company: master.id }));
  }

  public async apiKeys(parent: Company): Promise<any[]> {
    const { id } = parent;

    const master = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.apiKeys', 'apiKey')
      .where('company.id = :id', { id })
      .getOne();

    const items = master ? master.apiKeys : [];

    return items.map((item) => ({ ...item, company: master.id }));
  }

  public async users(parent: Company): Promise<any[]> {
    const { id } = parent;

    const master = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.users', 'user')
      .where('company.id = :id', { id })
      .getOne();

    const items = master ? master.users : [];

    return items.map((item) => ({ ...item, company: master.id }));
  }
}
