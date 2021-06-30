import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateId } from 'src/utils';
import { Not, Repository } from 'typeorm';

import { Company } from './company.entity';

import { CreateCompanyInput } from './dto/create-company-input.dto';
import { GetOneByCompanyByOneField } from './dto/get-one-company-by-one-field-input.dto';
import { GetOneCompanyInput } from './dto/get-one-company-input.dto';
import { UpdateCompanyInput } from './dto/update-company-input.dto';
@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    readonly repository: Repository<Company>,
  ) {}

  public async create(
    createCompanyInput: CreateCompanyInput,
  ): Promise<Company> {
    const { name, firebaseAdminConfig, firebaseConfig } = createCompanyInput;

    const existingByName = await this.getOneByOneField({
      field: 'name',
      value: name,
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

  public async getOneByOneField(
    getOneByCompanyByOneField: GetOneByCompanyByOneField,
  ): Promise<Company | undefined> {
    const { field, value, checkIfExists = false } = getOneByCompanyByOneField;

    const existing = await this.repository.findOne({ [field]: value });

    if (!existing && checkIfExists) {
      throw new NotFoundException(
        `can't get the user with the ${field} ${value}.`,
      );
    }

    return existing || undefined;
  }

  public async getOne(
    getOneCompanyInput: GetOneCompanyInput,
  ): Promise<Company | undefined> {
    const { uid } = getOneCompanyInput;

    const existing = await this.getOneByOneField({
      field: 'uid',
      value: uid,
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
}
