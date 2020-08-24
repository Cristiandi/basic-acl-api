import * as firebaseAdmin from 'firebase-admin';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';
import { COUNTRY_CODES_PHONE_NUMBER, COUNTRY_CODES_PHONE_NUMBER_OBJECT } from './firebase-admin.constants';

@Injectable()
export class FirebaseAdminService {
  constructor(
    private readonly companiesService: CompaniesService,
    @Inject(COUNTRY_CODES_PHONE_NUMBER) private readonly countryCodesPhoneNumber: typeof COUNTRY_CODES_PHONE_NUMBER_OBJECT
  ) {
    Logger.debug(`countryCodesPhoneNumber ${JSON.stringify(countryCodesPhoneNumber)}`, 'FirebaseAdminService');
  }

  private async initAdmin (companyUuid: string): Promise<firebaseAdmin.app.App> {
    const accountService = await this.companiesService.getServiceAccount({ uuid: companyUuid });

    const admin = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(accountService)
    });

    return admin;
  }

  public async createUser (
    companyUuid: string,
    email: string,
    password: string,
    phone: string,
    countryCode: string
  ): Promise<firebaseAdmin.auth.UserRecord> {
    const admin = await this.initAdmin(companyUuid);

    const properties = {
      email,
      password,
      phoneNumber: `${this.countryCodesPhoneNumber[countryCode]}${phone}`
    };

    const userRecord = await admin.auth().createUser(properties);

    await admin.delete();

    return userRecord;
  }
}
