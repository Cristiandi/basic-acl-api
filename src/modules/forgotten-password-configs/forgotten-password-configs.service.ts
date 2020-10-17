import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ForgottenPasswordConfig } from './forgotten-password-config.entity';

import { CompaniesService } from '../companies/companies.service';

import { CreateInput } from './dto/create-input.dto';

@Injectable()
export class ForgottenPasswordConfigsService {
  constructor(
    @InjectRepository(ForgottenPasswordConfig)
    private readonly forgottenPasswordConfigRepository: Repository<ForgottenPasswordConfig>,
    private readonly companiesService: CompaniesService
  ) {}

  public async create(createInput: CreateInput): Promise<ForgottenPasswordConfig> {
    const { companyUuid } = createInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can't get the company with uuid ${companyUuid}.`);
    }

    const existing = await this.forgottenPasswordConfigRepository.createQueryBuilder('fpc')
      .innerJoin('fpc.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .getOne();

    if (existing) {
      throw new HttpException('the company already has a forgotten password config.', HttpStatus.PRECONDITION_FAILED);
    }

    const { redirectUrl, subject } = createInput;

    const created = await this.forgottenPasswordConfigRepository.create({
      company,
      redirectUrl,
      subject
    });

    const saved = await this.forgottenPasswordConfigRepository.save(created);

    delete saved.company;

    return saved;
  }
}
