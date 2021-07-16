import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';
import { generateId } from 'src/utils';
import { Not, Repository } from 'typeorm';

import { Company } from './company.entity';

import { CreateCompanyInput } from './dto/create-company-input.dto';
import { GetOneCompanyInput } from './dto/get-one-company-input.dto';
import { UpdateCompanyInput } from './dto/update-company-input.dto';
@Injectable()
export class CompaniesService extends BaseService<Company> {
  constructor(
    @InjectRepository(Company)
    protected readonly repository: Repository<Company>,
  ) {
    super(repository);
  }

  public async create(
    createCompanyInput: CreateCompanyInput,
  ): Promise<Company> {
    const { name, firebaseAdminConfig, firebaseConfig } = createCompanyInput;

    const existingByName = await this.getOneByOneFields({
      fields: { name },
      checkIfExists: false,
    });

    if (existingByName) {
      throw new ConflictException(
        `already exists the company with name ${name}.`,
      );
    }

    const accessKey = generateId(20);

    const created = await this.repository.create({
      name,
      accessKey,
      firebaseAdminConfig,
      firebaseConfig,
    });

    const saved = await this.repository.save(created);

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

    const otherExisting = await this.repository.findOne({
      where: {
        name,
        id: Not(existing.id),
      },
    });

    if (otherExisting) {
      throw new ConflictException(`the name is being used for other company`);
    }

    const preloaded = await this.repository.preload({
      id: existing.id,
      ...updateCompanyInput,
    });

    const saved = await this.repository.save(preloaded);

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

    await this.repository.softRemove(existing);

    delete clone.firebaseAdminConfig;
    delete clone.firebaseConfig;

    return clone as Company;
  }
}
