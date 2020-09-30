import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import uuid from 'uuid';

import { CompaniesService } from '../companies/companies.service';

import { ConfirmationEmailConfig } from './confirmation-email-config.entity';


import { CreateConfirmationEmailCionfig } from './dto/create-confirmation-email-config-input.dto';
import { FindAllConfirmationEmailConfigsParamInput } from './dto/find-all-confirmation-email-configs-param-input.dto';
import { FindAllConfirmationEmailConfigsQueryInput } from './dto/find-all-confirmation-email-configs-query-input.dto';

@Injectable()
export class ConfirmationEmailConfigsService {
  constructor(
    @InjectRepository(ConfirmationEmailConfig)
    private readonly confirmationEmailConfigRepository: Repository<ConfirmationEmailConfig>,
    private readonly companiesService: CompaniesService
  ) { }

  /**
   *
   *
   * @param {CreateConfirmationEmailCionfig} createConfirmationEmailCionfig
   * @return {*}  {Promise<ConfirmationEmailConfig>}
   * @memberof ConfirmationEmailConfigsService
   */
  public async create(createConfirmationEmailCionfig: CreateConfirmationEmailCionfig): Promise<ConfirmationEmailConfig> {
    const { companyUuid } = createConfirmationEmailCionfig;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can't get the company with uuid ${uuid}.`);
    }

    const existing = await this.confirmationEmailConfigRepository.createQueryBuilder('cec')
      .innerJoin('cec.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .getOne();

    if (existing) {
      throw new HttpException('the company already has a confirmation email config.', HttpStatus.PRECONDITION_FAILED);
    }

    const { from, redirectUrl, subject } = createConfirmationEmailCionfig;

    const created = this.confirmationEmailConfigRepository.create({
      company,
      from,
      redirectUrl,
      subject
    });

    delete created.company;

    return this.confirmationEmailConfigRepository.save(created);
  }

  public async findAll(
    findAllConfirmationEmailConfigsParamInput: FindAllConfirmationEmailConfigsParamInput,
    findAllConfirmationEmailConfigsQueryInput: FindAllConfirmationEmailConfigsQueryInput
  ): Promise<ConfirmationEmailConfig[]> {
    const { companyUuid } = findAllConfirmationEmailConfigsParamInput;
    const { limit, offset } = findAllConfirmationEmailConfigsQueryInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can not get the company with uuid ${company}`);
    }

    return this.confirmationEmailConfigRepository.find({
      select: ['id', 'from', 'subject', 'redirectUrl', 'createdAt', 'updatedAt'],
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
}
