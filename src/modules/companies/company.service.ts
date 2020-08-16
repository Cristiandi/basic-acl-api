import { Database } from '../../database'
import { injectable } from 'tsyringe'

import { throwError, generateUuid } from '../../utils'

import { CreateCompanyDto } from './dtos/create-company.dto'
import { FindOneCompanyDto } from './dtos/find-one-company.dto'

@injectable()
export class CompanyService {
  constructor (private readonly database: Database) {}

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
}
