import { injectable } from 'tsyringe'

import { Database } from '../../database'
import { CompanyDao } from './company.dao'

import { throwError, generateUuid } from '../../utils'

import { CreateCompanyDto } from './dtos/create-company.dto'
import { FindOneCompanyDto } from './dtos/find-one-company.dto'
import { FindAllCompaniesDto } from './dtos/find-all.companies'
import { UpdateCoffeeDto } from './dtos/update-company-dto'

@injectable()
export class CompanyService {
  constructor (
    private readonly database: Database,
    private readonly companyDao: CompanyDao
  ) {}

  public async create (createCompanyDto: CreateCompanyDto): Promise<any> {
    const toCreate = {
      ...createCompanyDto,
      service_account: JSON.stringify(createCompanyDto.service_account),
      uuid: createCompanyDto.uuid || generateUuid()
    }

    const existingByUuid = await this.database.getOne('companies', { uuid: toCreate.uuid })
    if (existingByUuid) {
      throw throwError(412, 'already exists a company with that uuid.')
    }

    const existingsByName = await this.database.getOne('companies', { name: toCreate.name })
    if (existingsByName) {
      throw throwError(412, 'already exists a company with that name.')
    }

    const created = await this.database.createOne('companies', toCreate)

    return created
  }

  public async findOne (findOneCompanyDto: FindOneCompanyDto): Promise<any> {
    const { id } = findOneCompanyDto
    const existing = await this.database.getOne('companies', { id })

    if (!existing) {
      throw throwError(404, `company ${id} not found`)
    }

    return existing
  }

  public async findAll (findallCompaniesDto: FindAllCompaniesDto): Promise<any[]> {
    const { limit, offset } = findallCompaniesDto

    const query = this.database
      .knex('companies')
      .select('*')
      .limit(limit || 1000)
      .offset(offset)

    const data = await query

    return data
  }

  public async update (findOneCompanyDto: FindOneCompanyDto, updateCompanyDto: UpdateCoffeeDto): Promise<any> {
    const existing = await this.findOne(findOneCompanyDto)

    if (updateCompanyDto.name) {
      const existingsByName = await this.database.getOne('companies', { name: updateCompanyDto.name })
      if (existingsByName && existing.id !== existingsByName.id) {
        throw throwError(412, 'already exists a company with that name.')
      }
    }

    if (updateCompanyDto.uuid) {
      const existingByUuid = await this.database.getOne('companies', { uuid: updateCompanyDto.uuid })
      if (existingByUuid && existing.id !== existingByUuid.id) {
        throw throwError(412, 'already exists a company with that uuid.')
      }
    }

    const updated = await this.database.updateOne('companies', existing.id, updateCompanyDto)

    return updated
  }

  public async remove (findOneCompanyDto: FindOneCompanyDto): Promise<any> {
    const existing = await this.findOne(findOneCompanyDto)

    await this.database.deleteOne(existing.id, 'companies')

    return {
      ...existing,
      id: undefined
    }
  }

  public async getServiceAccount (uuid: string): Promise<any> {
    return this.companyDao.getServiceAccount(uuid)
  }
}
