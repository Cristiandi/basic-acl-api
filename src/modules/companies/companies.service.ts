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
      serviceAccount: createCompanyInput.serviceAccount as any
    });

    return this.companiesRepository.save(created);
  }

  async findAll(findAllCompaniesInput: FindAllCompaniesInput): Promise<Company[]> {
    const { limit = 1, offset = 0 } = findAllCompaniesInput;

    return this.companiesRepository.find({
      take: limit,
      skip: offset
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
}
