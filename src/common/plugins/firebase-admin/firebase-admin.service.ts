import * as firebaseAdmin from 'firebase-admin';
import { Injectable, Inject, Logger } from '@nestjs/common';

import { CompaniesService } from '../../../modules/companies/companies.service';

import { COUNTRY_CODES_PHONE_NUMBER, COUNTRY_CODES_PHONE_NUMBER_OBJECT } from './firebase-admin.constants';

import { InitAppInput } from './dto/init-app-input.dto';
import { CreateUserInput } from './dto/create-user-input.dto';
import { VerifyTokenInput } from './dto/verify-token-input.dto';

@Injectable()
export class FirebaseAdminService {
  constructor(
    private readonly companiesService: CompaniesService,
    @Inject(COUNTRY_CODES_PHONE_NUMBER) private readonly countryCodesPhoneNumber: typeof COUNTRY_CODES_PHONE_NUMBER_OBJECT
  ) {
    Logger.debug(`countryCodesPhoneNumber ${JSON.stringify(countryCodesPhoneNumber)}`, 'FirebaseAdminService');
  }

  private async initApp (initAppInput: InitAppInput): Promise<firebaseAdmin.app.App> {
    const { uuid } = initAppInput;
    const accountService = await this.companiesService.getServiceAccount({ uuid });

    if (!firebaseAdmin.apps.length) {
      const app = firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(accountService)
      });
  
      return app;
    }

    const existingApp = firebaseAdmin.apps.find(app => app.name === uuid);
    if (existingApp) return existingApp;

    const app = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(accountService)
    }, uuid);
    return app;
  }

  public async createUser (createUserInput: CreateUserInput): Promise<firebaseAdmin.auth.UserRecord> {
    const { companyUuid } = createUserInput;
    const admin = await this.initApp({ uuid: companyUuid });

    const { email, password, countryCode, phone } = createUserInput;
    const properties = {
      email,
      password,
      phoneNumber: `${this.countryCodesPhoneNumber[countryCode]}${phone}`
    };

    const userRecord = await admin.auth().createUser(properties);
    return userRecord;
  }

  public async verifyToken (verifyTokenInput: VerifyTokenInput): Promise<firebaseAdmin.auth.DecodedIdToken> {
    const { companyUuid } = verifyTokenInput;
    
    const app = await this.initApp({ uuid: companyUuid });

    const { token } = verifyTokenInput;
    const decodedToken = await app.auth().verifyIdToken(token);

    return decodedToken; 
  }
}
