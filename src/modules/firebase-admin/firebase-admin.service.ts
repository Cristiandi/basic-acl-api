import * as firebaseAdmin from 'firebase-admin'
import { injectable } from 'tsyringe'
import { CompanyService } from '../companies/company.service'
import { countryCodesPhoneNumber } from './firebase-admin.constants'

@injectable()
export class FirebaseAdminService {
  constructor (private readonly companyService: CompanyService) {}

  private async initAdmin (companyUuid: string): Promise<firebaseAdmin.app.App> {
    const account_service = await this.companyService.getServiceAccount(companyUuid)

    const admin = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(account_service)
    })

    return admin
  }

  public async createUser (
    companyUuid: string,
    email: string,
    password: string,
    phone: string,
    countryCode: string
  ): Promise<firebaseAdmin.auth.UserRecord> {
    const admin = await this.initAdmin(companyUuid)

    const properties = {
      email,
      password,
      phoneNumber: `${countryCodesPhoneNumber[countryCode]}${phone}`
    }

    const userRecord = await admin.auth().createUser(properties)

    await admin.delete()

    return userRecord
  }
}
