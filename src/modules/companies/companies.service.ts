import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { generateUuid } from '../../utils';

import { Company } from './company.entity';

import { CreateCompanyInput } from './dto/create-company-input.dto';
import { FindAllCompaniesInput } from './dto/find-all-companies-input.dto';
import { FindOneCompanyInput } from './dto/find-one-company-input.dto';
import { UpdateCompanyInput } from './dto/update-company-input.dto';
import { GetServiceAccountInput } from './dto/get-service-account-input.dto';
import { GetFirebaseConfigInput } from './dto/get-firebase-config-input.dto';
import { GetCompanyByNameInput } from './dto/get-company-by-name-input.dto';
import { GetCompanyByUuidInput } from './dto/get-company-by-uuid-input.dto';

@Injectable()
export class CompaniesService {
  constructor(
  @InjectRepository(Company)
  private readonly companiesRepository: Repository<Company>
  ) {}

  async create(createCompanyInput: CreateCompanyInput): Promise<Company> {
    const query = this.companiesRepository.find({
      select: [ 'id' ],
      where: [
        {
          uuid: createCompanyInput.uuid
        },
        {
          name: createCompanyInput.name
        }
      ],
      take: 1
    });

    const existing = await query;

    if (existing.length) {
      throw new HttpException('already exists a company for the name or the uuid', HttpStatus.PRECONDITION_FAILED);
    }

    const created = this.companiesRepository.create({
      name: createCompanyInput.name,
      countryCode: createCompanyInput.countryCode,
      uuid: createCompanyInput.uuid || generateUuid(),
      serviceAccount: createCompanyInput.serviceAccount as any,
      firebaseConfig: createCompanyInput.firebaseConfig as any
    });

    return this.companiesRepository.save(created);
  }

  async findAll(findAllCompaniesInput: FindAllCompaniesInput): Promise<Company[]> {
    const { limit = 0, offset = 0 } = findAllCompaniesInput;

    return this.companiesRepository.find({
      take: limit || undefined,
      skip: offset,
      order: {
        id: 'DESC'
      }
    });
  }

  async findOne(findOneCompanyInput: FindOneCompanyInput): Promise<Company> {
    const { id } = findOneCompanyInput;
    const existing = await this.companiesRepository.findOne(id);

    if (!existing) {
      throw new NotFoundException(`company ${id} not found`);
    }

    return existing;
  }

  async update(findOneCompanyInput: FindOneCompanyInput, updateCompanyInput: UpdateCompanyInput): Promise<Company> {
    const { id } = findOneCompanyInput;

    const existing = await this.companiesRepository.preload({
      id: +id,
      ...updateCompanyInput,
      serviceAccount: updateCompanyInput.serviceAccount ? updateCompanyInput.serviceAccount as any : undefined
    });

    if (!existing) {
      throw new NotFoundException(`coffee ${id} not found`);
    }

    const compareTo = await this.companiesRepository.find({
      where: [
        {
          name: existing.name
        },
        {
          uuid: existing.uuid
        }
      ]
    });

    if (compareTo.length) {
      const [companyToCompare] = compareTo;

      if (companyToCompare.id !== existing.id) {
        throw new HttpException('other company already exists for the name or uuid', 412);
      }
    }

    return this.companiesRepository.save(existing);
  }

  async remove(findOneCompanyInput: FindOneCompanyInput): Promise<Company> {
    const existing = await this.findOne(findOneCompanyInput);

    return this.companiesRepository.remove(existing);
  }

  async getServiceAccount(getServiceAccountInput: GetServiceAccountInput): Promise<string> {
    const { uuid } = getServiceAccountInput;
    
    const existing = await this.companiesRepository.find({
      select: ['serviceAccount'],
      where: { uuid }
    });

    if (!existing.length) {
      throw new NotFoundException(`can't get the company with uuid ${uuid}.`);
    }

    const [company] = existing;

    return company.serviceAccount;
  }

  async getFirebaseConfig(getFirebaseConfigInput: GetFirebaseConfigInput): Promise<string> {
    const { uuid } = getFirebaseConfigInput;
    
    const existing = await this.companiesRepository.find({
      select: ['firebaseConfig'],
      where: { uuid }
    });

    if (!existing.length) {
      throw new NotFoundException(`can't get the company with uuid ${uuid}.`);
    }

    const [company] = existing;

    return company.firebaseConfig;
  }

  async getCompanyByName(getCompanyByNameInput: GetCompanyByNameInput): Promise<Company> {
    const { name } = getCompanyByNameInput;

    const data = await this.companiesRepository.find({
      where: {
        name: name
      }
    });

    if (!data.length) {
      throw new NotFoundException(`can't get the company with name ${name}.`);
    }

    const [company] = data;

    return company;
  }

  async getCompanyByUuid(getCompanyByUuidInput: GetCompanyByUuidInput): Promise<Company> {
    const { uuid } = getCompanyByUuidInput;

    const data = await this.companiesRepository.find({
      where: {
        uuid
      }
    });

    if (!data.length) {
      throw new NotFoundException(`can't get the company with uuid ${uuid}.`);
    }

    const [company] = data;

    return company;
  }
}
