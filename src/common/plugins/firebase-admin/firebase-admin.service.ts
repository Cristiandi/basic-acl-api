import  * as firebaseAdmin from 'firebase-admin';
import { Injectable, Inject, Logger, PreconditionFailedException } from '@nestjs/common';

import { CompaniesService } from '../../../modules/companies/companies.service';

import { COUNTRY_CODES_PHONE_NUMBER, COUNTRY_CODES_PHONE_NUMBER_OBJECT } from './firebase-admin.constants';

import { InitAppInput } from './dto/init-app-input.dto';
import { CreateUserInput } from './dto/create-user-input.dto';
import { VerifyTokenInput } from './dto/verify-token-input.dto';
import { GetUsersInput } from './dto/get-users-input.dto';
import { UpdateUserInput } from './dto/update-user-input.dto';
import { GetUserByUidInput } from './dto/get-user-by-uid-input.dto';
import { RemoveUserInput } from './dto/remove-user-input.dto';

@Injectable()
export class FirebaseAdminService {
  constructor(
    private readonly companiesService: CompaniesService,
    @Inject(COUNTRY_CODES_PHONE_NUMBER) private readonly countryCodesPhoneNumber: typeof COUNTRY_CODES_PHONE_NUMBER_OBJECT
  ) {
    Logger.debug(`countryCodesPhoneNumber ${JSON.stringify(countryCodesPhoneNumber)}`, 'FirebaseAdminService');
  }

  private async initApp(initAppInput: InitAppInput): Promise<firebaseAdmin.app.App> {
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

  public async createUser(createUserInput: CreateUserInput): Promise<firebaseAdmin.auth.UserRecord> {
    const { companyUuid } = createUserInput;
    const admin = await this.initApp({ uuid: companyUuid });

    const { email, password, countryCode, phone } = createUserInput;

    const phoneNumber = `${this.countryCodesPhoneNumber[countryCode]}${phone}`;

    try {
      const userByEmail = await admin.auth().getUserByEmail(email);

      if (userByEmail) {
        throw new PreconditionFailedException(`already exists a user in firebase with the email ${email} for the company ${companyUuid}.`);
      }
    } catch (error) {
      if (error instanceof PreconditionFailedException) {
        throw error;
      }
      // Logger.log(`the user with email ${email} doesn't exists in firebase for the company ${companyUuid}!`, 'FirebaseAdminService');
    }

    try {
      const userByPhone = await admin.auth().getUserByPhoneNumber(phoneNumber);

      if (userByPhone) {
        throw new PreconditionFailedException(`already exists a user in firebase with the phone ${phoneNumber} for the company ${companyUuid}.`);
      }
    } catch (error) {
      if (error instanceof PreconditionFailedException) {
        throw error;
      }
      // Logger.log(`the user with phone ${phoneNumber} doesn't exists in firebase for the company ${companyUuid}!`, 'FirebaseAdminService');
    }

    const properties = {
      email,
      password,
      phoneNumber
    };

    const userRecord = await admin.auth().createUser(properties);
    return userRecord;
  }

  public async getUsers(getUsersInput: GetUsersInput): Promise<firebaseAdmin.auth.UserRecord[]> {
    const { companyUuid } = getUsersInput;

    const app = await this.initApp({ uuid: companyUuid });

    const maxResults = 1000;

    let nextPageToken: string;

    let listUsersResult = await app.auth().listUsers(maxResults, nextPageToken);

    nextPageToken = listUsersResult.pageToken;

    let userList = [...listUsersResult.users];

    while (nextPageToken) {
      listUsersResult = await app.auth().listUsers(maxResults, nextPageToken);

      nextPageToken = listUsersResult.pageToken;
      userList = [...userList, ...listUsersResult.users];
      // console.log('nextPageToken', nextPageToken, !nextPageToken);
      // console.log('rows fetched:', userList.length);
    }

    return userList;
  }

  public async getUserByUid(getUserByUidInput: GetUserByUidInput): Promise<firebaseAdmin.auth.UserRecord> {
    const { companyUuid } = getUserByUidInput;

    const app = await this.initApp({ uuid: companyUuid });

    try {
      const { uid } = getUserByUidInput;

      const user = await app.auth().getUser(uid);

      return user;
    } catch (error) {
      return null;
    }
  }

  public async updateUser(updateUserInput: UpdateUserInput): Promise<firebaseAdmin.auth.UserRecord> {
    const { companyUuid } = updateUserInput;

    const app = await this.initApp({ uuid: companyUuid });

    const { uid } = updateUserInput;

    const { countryCode, phone, email, password } = updateUserInput;

    let updateRequest = {};
    if (email) updateRequest = { ...updateRequest, email };
    if (password) updateRequest = { ...updateRequest, password };
    if (phone) updateRequest = { ...updateRequest, phone: `${this.countryCodesPhoneNumber[countryCode]}${phone}` };

    // console.log(updateRequest, 'updateRequest');

    return app.auth().updateUser(uid, updateRequest);
  }

  public async deleteUser(removeUserInput: RemoveUserInput): Promise<void> {
    const { companyUuid } = removeUserInput;

    const app = await this.initApp({ uuid: companyUuid });

    const { uid } = removeUserInput;

    return app.auth().deleteUser(uid);
  }

  public async verifyToken(verifyTokenInput: VerifyTokenInput): Promise<firebaseAdmin.auth.DecodedIdToken> {
    const { companyUuid } = verifyTokenInput;

    const app = await this.initApp({ uuid: companyUuid });

    const { token } = verifyTokenInput;
    const decodedToken = await app.auth().verifyIdToken(token);

    return decodedToken;
  }
}
