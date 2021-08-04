import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { generateUuid } from '../../utils';

import { ApiKey } from './api-key.entity';

import { CompaniesService } from '../companies/companies.service';

import { CreateApiKeyInput } from './dto/create-api-key-input.dto';
import { FindAllApiKeysParamInput } from './dto/find-all-api-keys-param-input.dto';
import { FindAllApiKeysQueryInput } from './dto/find-all-api-keys-query-input.dto';
import { FindOneApiKeyInput } from './dto/find-one-api-key-input.dto';
import { UpdateApiKeyInput } from './dto/update-api-key-input.dto';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
    private readonly companiesService: CompaniesService
  ) { }

  public async create(createApiKeyInput: CreateApiKeyInput): Promise<ApiKey> {
    const { companyUuid } = createApiKeyInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can't get the company with uuid ${companyUuid}.`);
    }

    const { prefix } = createApiKeyInput;

    const created = this.apiKeyRepository.create({
      company,
      enable: true,
      value: `${prefix}-${generateUuid(10)}`
    });

    const saved = await this.apiKeyRepository.save(created);

    delete saved.company;

    return saved;
  }

  public async findAll(
    findAllApiKeysParamInput: FindAllApiKeysParamInput,
    findAllApiKeysQueryInput: FindAllApiKeysQueryInput
  ): Promise<ApiKey[]> {
    const { companyUuid } = findAllApiKeysParamInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can't get the company with uuid ${companyUuid}.`);
    }

    const { limit = 0, offset = 0 } = findAllApiKeysQueryInput;

    return this.apiKeyRepository.find({
      select: ['id', 'value', 'enable', 'createdAt', 'updatedAt'],
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

  public async findOne(findOneApiKeyInput: FindOneApiKeyInput): Promise<ApiKey | null> {
    const { id, companyUuid } = findOneApiKeyInput;
    const existing = await this.apiKeyRepository.createQueryBuilder('ak')
      .innerJoin('ak.company', 'c')
      .where('ak.id = :id', { id })
      .andWhere('c.uuid = :companyUuid', { companyUuid })
      .getOne();

    if (!existing) {
      return null;
    }

    return existing;
  }

  public async update(
    findOneApiKeyInput: FindOneApiKeyInput,
    updateApiKeyInput: UpdateApiKeyInput
  ): Promise<ApiKey> {
    const { id, companyUuid } = findOneApiKeyInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can't get the company with uuid ${companyUuid}`);
    }

    const existing = await this.apiKeyRepository.preload({
      id: +id,
      company,
      ...updateApiKeyInput
    });

    if (!existing) {
      throw new NotFoundException(`api key ${id} not found.`);
    }

    const saved = await this.apiKeyRepository.save(existing);

    delete saved.company;

    return saved;
  }

  public async remove(findOneApiKeyInput: FindOneApiKeyInput): Promise<ApiKey> {
    const existing = await this.findOne(findOneApiKeyInput);

    if (!existing) {
      throw new NotFoundException(`can't get the api key ${findOneApiKeyInput.id} for the company with uuid ${findOneApiKeyInput.companyUuid}.`);
    }

    const removed = await this.apiKeyRepository.remove(existing);

    delete removed.company;

    return removed;
  }
}
