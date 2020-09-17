import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { generateUuid } from '../../utils';

import { ApiKey } from './api-key.entity';

import { CompaniesService } from '../companies/companies.service';

import { CreateApiKeyInput } from './dto/create-api-key-input.dto';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
    private readonly companiesService: CompaniesService
  ) {}

  public async create(createApiKeyInput: CreateApiKeyInput) {
    const { companyUuid } = createApiKeyInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can't get the company with uuid ${companyUuid}.`);
    }

    const { prefix } = createApiKeyInput;

    const created = this.apiKeyRepository.create({
      company,
      enable: true,
      value: `${prefix}-${generateUuid()}`
    });

    const saved = await this.apiKeyRepository.save(created);

    delete saved.company;

    return saved;
  }
}
