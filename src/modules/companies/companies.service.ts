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
import { GetYourCompanyInput } from './dto/get-your-company-input.dto';
import { SetConfirmationEmailConfigFlagInput } from './dto/set-confirmation-email-config-flag-input.dto';
import { SetForgottenPasswordFlagConfigFlagInput } from './dto/set-forgotten-password-config-flag-input.dto';

@Injectable()
export class CompaniesService {
  constructor(
  @InjectRepository(Company)
  private readonly companiesRepository: Repository<Company>
  ) {}

  public async create(createCompanyInput: CreateCompanyInput): Promise<Company> {
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

  public async findAll(findAllCompaniesInput: FindAllCompaniesInput): Promise<Company[]> {
    const { limit = 0, offset = 0 } = findAllCompaniesInput;

    return this.companiesRepository.find({
      take: limit || undefined,
      skip: offset,
      order: {
        id: 'DESC'
      }
    });
  }

  public async findOne(findOneCompanyInput: FindOneCompanyInput): Promise<Company> {
    const { id } = findOneCompanyInput;
    const existing = await this.companiesRepository.findOne(id);

    if (!existing) {
      throw new NotFoundException(`company ${id} not found`);
    }

    return existing;
  }

  public async update(findOneCompanyInput: FindOneCompanyInput, updateCompanyInput: UpdateCompanyInput): Promise<Company> {
    const { id } = findOneCompanyInput;

    const existing = await this.companiesRepository.preload({
      id: +id,
      ...updateCompanyInput,
      serviceAccount: updateCompanyInput.serviceAccount ? updateCompanyInput.serviceAccount as any : undefined,
      firebaseConfig: updateCompanyInput.firebaseConfig ? updateCompanyInput.firebaseConfig as any : undefined,
      confirmationEmailConfig: updateCompanyInput.confirmationEmailConfig === undefined ? undefined : updateCompanyInput.confirmationEmailConfig
    });

    if (!existing) {
      throw new NotFoundException(`company ${id} not found.`);
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

  public async remove(findOneCompanyInput: FindOneCompanyInput): Promise<Company> {
    const existing = await this.findOne(findOneCompanyInput);

    return this.companiesRepository.remove(existing);
  }

  public async getServiceAccount(getServiceAccountInput: GetServiceAccountInput): Promise<string> {
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

  public async getFirebaseConfig(getFirebaseConfigInput: GetFirebaseConfigInput): Promise<string> {
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

  public async getCompanyByName(getCompanyByNameInput: GetCompanyByNameInput): Promise<Company> {
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

  public async getCompanyByUuid(getCompanyByUuidInput: GetCompanyByUuidInput): Promise<Company | null> {
    const { uuid } = getCompanyByUuidInput;

    const data = await this.companiesRepository.find({
      where: {
        uuid
      }
    });

    if (!data.length) {
      return null;
    }

    const [company] = data;

    return company;
  }

  public async getYourCompany(getYourCompanyInput: GetYourCompanyInput): Promise<Company> {
    const { uuid } = getYourCompanyInput;

    const company = await this.getCompanyByUuid({ uuid });

    if (!company) {
      throw new NotFoundException(`can not get the company with uuid ${uuid}.`);
    }

    return company;
  }

  public async setConfirmationEmailConfigFlag(setConfirmationEmailConfigFlagInput: SetConfirmationEmailConfigFlagInput): Promise<Company> {
    const { uuid } = setConfirmationEmailConfigFlagInput;

    const company = await this.getCompanyByUuid({ uuid });

    if (!company) {
      throw new NotFoundException(`can't get the company with uuid ${uuid}.`);
    }

    const { confirmationEmailConfig } = setConfirmationEmailConfigFlagInput;

    company.confirmationEmailConfig = confirmationEmailConfig;

    return this.companiesRepository.save(company);
  }

  public async setForgottenPasswordConfigFlag(setForgottenPasswordFlagConfigFlagInput: SetForgottenPasswordFlagConfigFlagInput): Promise<Company> {
    const { uuid } = setForgottenPasswordFlagConfigFlagInput;

    const company = await this.getCompanyByUuid({ uuid });

    if (!company) {
      throw new NotFoundException(`can't get the company with uuid ${uuid}.`);
    }

    const { forgottenPasswordConfig } = setForgottenPasswordFlagConfigFlagInput;

    company.forgottenPasswordConfig = forgottenPasswordConfig;

    return this.companiesRepository.save(company);
  }
}
