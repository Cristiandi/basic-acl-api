import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateId } from 'src/utils';
import { Repository } from 'typeorm';

import { Company } from './company.entity';

import { CreateCompanyInput } from './dto/create-company-input.dto';
import { GetOneByCompanyByOneField } from './dto/get-one-company-by-one-field-input.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    readonly repository: Repository<Company>,
  ) {}

  public async create(input: CreateCompanyInput): Promise<Company> {
    const { name, firebaseAdminConfig, firebaseConfig } = input;

    const existingByName = await this.findOneByOneField({
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

  public async findOneByOneField(
    input: GetOneByCompanyByOneField,
  ): Promise<Company | undefined> {
    const { field, value, checkIfExists = false } = input;

    const existing = await this.repository.findOne({ [field]: value });

    if (!existing && checkIfExists) {
      throw new NotFoundException(
        `can't get the user with the ${field} ${value}.`,
      );
    }

    return existing || undefined;
  }
}
