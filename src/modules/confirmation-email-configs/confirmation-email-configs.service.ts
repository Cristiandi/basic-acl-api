import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import uuid from 'uuid';

import { CompaniesService } from '../companies/companies.service';

import { ConfirmationEmailConfig } from './confirmation-email-config.entity';


import { CreateConfirmationEmailCionfig } from './dto/create-confirmation-email-config-input.dto';
import { FindAllConfirmationEmailConfigsParamInput } from './dto/find-all-confirmation-email-configs-param-input.dto';
import { FindAllConfirmationEmailConfigsQueryInput } from './dto/find-all-confirmation-email-configs-query-input.dto';
import { FindOneConfirmationEmailConfigInput } from './dto/find-one-confirmation-email-config-input.dto';
import { GetOneByCompanyInput } from './dto/get-one-by-company-input.dto';
import { UpdateConfirmationEmailConfigInput } from './dto/update-confirmation-email-config-input.dto';

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

    const { redirectUrl, subject } = createConfirmationEmailCionfig;

    const created = this.confirmationEmailConfigRepository.create({
      company,
      redirectUrl,
      subject
    });

    const saved = await this.confirmationEmailConfigRepository.save(created);

    delete saved.company;

    return saved;
  }

  /**
   *
   *
   * @param {FindAllConfirmationEmailConfigsParamInput} findAllConfirmationEmailConfigsParamInput
   * @param {FindAllConfirmationEmailConfigsQueryInput} findAllConfirmationEmailConfigsQueryInput
   * @return {*}  {Promise<ConfirmationEmailConfig[]>}
   * @memberof ConfirmationEmailConfigsService
   */
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
      select: ['id', 'subject', 'redirectUrl', 'createdAt', 'updatedAt'],
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

  /**
   *
   *
   * @param {FindOneConfirmationEmailConfigInput} findOneConfirmationEmailConfigInput
   * @return {*}  {Promise<ConfirmationEmailConfig>}
   * @memberof ConfirmationEmailConfigsService
   */
  public async findOne(findOneConfirmationEmailConfigInput: FindOneConfirmationEmailConfigInput): Promise<ConfirmationEmailConfig> {
    const { companyUuid, id } = findOneConfirmationEmailConfigInput;

    const existing = await this.confirmationEmailConfigRepository.createQueryBuilder('cec')
      .innerJoin('cec.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('cec.id = :id', { id })
      .getOne();

    if (!existing) {
      throw new NotFoundException(`can't get the confirmation email config ${id} for the company ${companyUuid}.`);
    }

    return existing;
  }

  /**
   *
   *
   * @param {FindOneConfirmationEmailConfigInput} findOneConfirmationEmailConfigInput
   * @param {UpdateConfirmationEmailConfigInput} updateConfirmationEmailConfigInput
   * @return {*}  {Promise<ConfirmationEmailConfig>}
   * @memberof ConfirmationEmailConfigsService
   */
  public async update(
    findOneConfirmationEmailConfigInput: FindOneConfirmationEmailConfigInput,
    updateConfirmationEmailConfigInput: UpdateConfirmationEmailConfigInput
    ): Promise<ConfirmationEmailConfig> {
      await this.findOne(findOneConfirmationEmailConfigInput);

      const { id } = findOneConfirmationEmailConfigInput;

      const existing = await this.confirmationEmailConfigRepository.preload({
        id: +id,
        ...updateConfirmationEmailConfigInput
      });

      return this.confirmationEmailConfigRepository.save(existing);
  }

  /**
   *
   *
   * @param {FindOneConfirmationEmailConfigInput} findOneConfirmationEmailConfigInput
   * @return {*}  {Promise<ConfirmationEmailConfig>}
   * @memberof ConfirmationEmailConfigsService
   */
  public async remove(findOneConfirmationEmailConfigInput: FindOneConfirmationEmailConfigInput): Promise<ConfirmationEmailConfig> {
    const existing = await this.findOne(findOneConfirmationEmailConfigInput);

    return this.confirmationEmailConfigRepository.remove(existing);
  }

  /**
   *
   *
   * @param {GetOneByCompanyInput} getOneByCompanyInput
   * @return {*}  {Promise<ConfirmationEmailConfig>}
   * @memberof ConfirmationEmailConfigsService
   */
  public async getOneByCompany(getOneByCompanyInput: GetOneByCompanyInput): Promise<ConfirmationEmailConfig | null> {
    const { companyUuid } = getOneByCompanyInput;

    const item = await this.confirmationEmailConfigRepository.createQueryBuilder('cec')
    .innerJoin('cec.company', 'c')
    .where('c.uuid = :companyUuid', { companyUuid })
    .getOne();

    return item || null;
  }
}
