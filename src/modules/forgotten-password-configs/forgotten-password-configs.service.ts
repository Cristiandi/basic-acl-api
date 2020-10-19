import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ForgottenPasswordConfig } from './forgotten-password-config.entity';

import { CompaniesService } from '../companies/companies.service';

import { CreateInput } from './dto/create-input.dto';
import { FindAllParamInput } from './dto/find-all-param-input.dto';
import { FindAllQueryInput } from './dto/find-alll-query-input.dto';
import { FindOneInput } from './dto/find-one-input.dto';
import { UpdateInput } from './dto/update-input.dto';
import { GetOneByCompanyInput } from './dto/get-one-by-company-input.dto';

@Injectable()
export class ForgottenPasswordConfigsService {
  constructor(
    @InjectRepository(ForgottenPasswordConfig)
    private readonly forgottenPasswordConfigRepository: Repository<ForgottenPasswordConfig>,
    private readonly companiesService: CompaniesService
  ) { }

  /**
   *
   *
   * @param {CreateInput} createInput
   * @return {*}  {Promise<ForgottenPasswordConfig>}
   * @memberof ForgottenPasswordConfigsService
   */
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

    this.companiesService.setForgottenPasswordConfigFlag({ uuid: companyUuid, forgottenPasswordConfig: true });

    delete saved.company;

    return saved;
  }

  /**
   *
   *
   * @param {FindAllParamInput} findAllParamInput
   * @param {FindAllQueryInput} findAllQueryInput
   * @return {*}  {Promise<ForgottenPasswordConfig[]>}
   * @memberof ForgottenPasswordConfigsService
   */
  public async findAll(
    findAllParamInput: FindAllParamInput,
    findAllQueryInput: FindAllQueryInput
  ): Promise<ForgottenPasswordConfig[]> {
    const { companyUuid } = findAllParamInput;
    const { limit, offset } = findAllQueryInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can not get the company with uuid ${company}`);
    }

    return this.forgottenPasswordConfigRepository.find({
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
   * @param {FindOneInput} findOneInput
   * @return {*}  {Promise<ForgottenPasswordConfig>}
   * @memberof ForgottenPasswordConfigsService
   */
  public async findOne(findOneInput: FindOneInput): Promise<ForgottenPasswordConfig> {
    const { companyUuid, id } = findOneInput;

    const existing = await this.forgottenPasswordConfigRepository.createQueryBuilder('fpc')
      .innerJoin('fpc.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('fpc.id = :id', { id })
      .getOne();

    if (!existing) {
      throw new NotFoundException(`can't get the forgotten password config ${id} for the company ${companyUuid}.`);
    }

    return existing;
  }

  /**
   *
   *
   * @param {FindOneInput} findOneInput
   * @param {UpdateInput} updateInput
   * @return {*}  {Promise<ForgottenPasswordConfig>}
   * @memberof ForgottenPasswordConfigsService
   */
  public async update(
    findOneInput: FindOneInput,
    updateInput: UpdateInput
  ): Promise<ForgottenPasswordConfig> {
    await this.findOne(findOneInput);

    const { id } = findOneInput;

    const preloaded = await this.forgottenPasswordConfigRepository.preload({
      id: +id,
      ...updateInput
    });

    return this.forgottenPasswordConfigRepository.save(preloaded);
  }

  /**
   *
   *
   * @param {FindOneInput} findOneInput
   * @return {*}  {Promise<ForgottenPasswordConfig>}
   * @memberof ForgottenPasswordConfigsService
   */
  public async remove(findOneInput: FindOneInput): Promise<ForgottenPasswordConfig> {
    const existing = await this.findOne(findOneInput);

    const { companyUuid } = findOneInput;

    this.companiesService.setForgottenPasswordConfigFlag({ uuid: companyUuid, forgottenPasswordConfig: false });

    return this.forgottenPasswordConfigRepository.remove(existing);
  }
  
  /**
   *
   *
   * @param {GetOneByCompanyInput} getOneByCompanyInput
   * @return {*}  {(Promise<ForgottenPasswordConfig | null>)}
   * @memberof ForgottenPasswordConfigsService
   */
  public async getOneByCompany(getOneByCompanyInput: GetOneByCompanyInput): Promise<ForgottenPasswordConfig | null> {
    const { companyUuid } = getOneByCompanyInput;

    const item = await this.forgottenPasswordConfigRepository.createQueryBuilder('fpc')
      .innerJoin('fpc.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .getOne();

    return item || null;
  }
}
