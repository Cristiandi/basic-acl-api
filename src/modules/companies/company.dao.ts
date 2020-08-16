import { injectable } from 'tsyringe'

import { Database } from '../../database'
import { throwError } from '../../utils'

@injectable()
export class CompanyDao {
  constructor (private readonly database: Database) {}

  public async getServiceAccount (uuid: string): Promise<any> {
    const item = await this.database.getOne('companies', { uuid })

    if (!item) throw throwError(404, `cna't get the company with uuid ${uuid}.`)

    return item.service_account
  }
}
