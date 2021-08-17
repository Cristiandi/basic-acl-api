import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../common/base.service';

import { ApiKey } from './api-key.entity';

import { CompanyService } from '../company/company.service';

import { generateId } from '../../utils';

import { CreateApiKeyInput } from './dto/create-api-key-input.dto';
import { GetOneApiKeyInput } from './dto/get-one-api-key-input.dto';
import { GetAllApiKeysInput } from './dto/get-all-api-key-input.dto';
import { UpdateApiKeyInput } from './dto/update-api-key-input.dto';

@Injectable()
export class ApiKeyService extends BaseService<ApiKey> {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
    private readonly companyService: CompanyService,
  ) {
    super(apiKeyRepository);
  }

  // CRUD

  public async create(input: CreateApiKeyInput): Promise<ApiKey> {
    const { companyUid } = input;

    const company = await this.companyService.getOne({
      uid: companyUid,
    });

    if (!company) {
      throw new NotFoundException(`company with uid ${companyUid} not found.`);
    }

    const value = generateId(20);

    const created = this.apiKeyRepository.create({
      value,
      ...company,
    });

    const saved = await this.apiKeyRepository.save(created);

    return saved;
  }

  public async getOne(input: GetOneApiKeyInput): Promise<ApiKey | undefined> {
    const { uid } = input;

    const existing = await this.getOneByOneFields({
      fields: { uid },
      checkIfExists: false,
    });

    return existing;
  }

  public async getAll(input: GetAllApiKeysInput): Promise<ApiKey[]> {
    const { companyUid, limit, skip, q } = input;

    const query = this.apiKeyRepository
      .createQueryBuilder('apiKey')
      .loadAllRelationIds()
      .innerJoin('apiKey.company', 'company')
      .where('company.uid = :companyUid', { companyUid });

    if (q)
      query.andWhere('apiKey.value ilike :q OR role.alias ilike :q', {
        q: `%${q}%`,
      });

    query.limit(limit || 10).skip(skip);

    const items = await query.getMany();

    return items;
  }

  public async update(
    getOneRoleInput: GetOneApiKeyInput,
    input: UpdateApiKeyInput,
  ): Promise<ApiKey> {
    const { uid } = getOneRoleInput;

    const existing = await this.getOneByOneFields({
      fields: { uid },
      checkIfExists: true,
    });

    const preloaded = await this.apiKeyRepository.preload({
      id: existing.id,
      ...input,
    });

    const saved = await this.apiKeyRepository.save(preloaded);

    return {
      ...existing,
      ...saved,
    } as ApiKey;
  }

  public async delete(input: GetOneApiKeyInput): Promise<ApiKey> {
    const { uid } = input;

    const existing = await this.getOneByOneFields({
      fields: { uid },
      checkIfExists: true,
    });

    const clone = { ...existing };

    await this.apiKeyRepository.softRemove(existing);

    return clone as ApiKey;
  }

  // CRUD
}
