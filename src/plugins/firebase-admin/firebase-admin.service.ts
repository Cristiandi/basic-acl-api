import * as firebaseAdmin from 'firebase-admin';

import { Injectable, PreconditionFailedException } from '@nestjs/common';

import { CompanyService } from '../../modules/company/services/company.service';
import { CompanyExtraService } from '../../modules/company/services/company-extra.service';

import { InitAppInput } from './dto/init-app-input.dto';
import { CreateUserInput } from './dto/create-user-input.dto';
import { GetUsersInput } from './dto/get-users-input.dto';
import { GetUserByUid } from './dto/get-user-by-uid-input.dto';
import { UpdateUserInput } from './dto/update-user-input.dto';
import { VerifyTokenInput } from './dto/verify-token-input.dto';
import { GetUserByPhoneInput } from './dto/get-user-by-phone-input.dto';
import { GetUserByEmailInput } from './dto/get-user-by-emial-input.dto';

@Injectable()
export class FirebaseAdminService {
  constructor(
    private readonly companyService: CompanyService,
    private readonly companyExtraService: CompanyExtraService,
  ) {}

  private async initApp(input: InitAppInput): Promise<firebaseAdmin.app.App> {
    const { companyUid } = input;

    const firebaseAdminConfig =
      await this.companyExtraService.getFirebaseAdminConfig({
        uid: companyUid,
      });

    if (!firebaseAdmin.apps.length) {
      const app = firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebaseAdminConfig),
      });

      return app;
    }

    const existingApp = firebaseAdmin.apps.find(
      (app) => app.name === companyUid,
    );
    if (existingApp) return existingApp;

    const app = firebaseAdmin.initializeApp(
      {
        credential: firebaseAdmin.credential.cert(firebaseAdminConfig),
      },
      companyUid,
    );
    return app;
  }

  public async createUser(
    createUserInput: CreateUserInput,
  ): Promise<firebaseAdmin.auth.UserRecord> {
    const { companyUid } = createUserInput;
    const admin = await this.initApp({ companyUid });

    const { email, password, phone } = createUserInput;

    try {
      const userByEmail = await admin.auth().getUserByEmail(email);

      if (userByEmail) {
        throw new PreconditionFailedException(
          `already exists a user in firebase with the email ${email}.`,
        );
      }
    } catch (error) {
      if (error instanceof PreconditionFailedException) {
        throw error;
      }
      // Logger.log(`the user with email ${email} doesn't exists in firebase for the company ${companyUuid}!`, 'FirebaseAdminService');
    }

    try {
      const userByPhone = await admin.auth().getUserByPhoneNumber(phone);

      if (userByPhone) {
        throw new PreconditionFailedException(
          `already exists a user in firebase with the phone ${phone}.`,
        );
      }
    } catch (error) {
      if (error instanceof PreconditionFailedException) {
        throw error;
      }
      // Logger.log(`the user with phone ${phoneNumber} doesn't exists in firebase for the company ${companyUuid}!`, 'FirebaseAdminService');
    }

    const properties: firebaseAdmin.auth.CreateRequest = {
      email,
      password,
      phoneNumber: phone,
    };

    const userRecord = await admin.auth().createUser(properties);
    return userRecord;
  }

  public async getUsers(
    getUsersInput: GetUsersInput,
  ): Promise<firebaseAdmin.auth.UserRecord[]> {
    const { companyUid } = getUsersInput;

    const app = await this.initApp({ companyUid });

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

  public async getUserByUid(
    getUserByUidInput: GetUserByUid,
  ): Promise<firebaseAdmin.auth.UserRecord> {
    const { companyUid } = getUserByUidInput;

    const app = await this.initApp({ companyUid });

    try {
      const { uid } = getUserByUidInput;

      const user = await app.auth().getUser(uid);

      return user;
    } catch (error) {
      return null;
    }
  }

  public async getUserByPhone(
    input: GetUserByPhoneInput,
  ): Promise<firebaseAdmin.auth.UserRecord> {
    const { companyUid, phone } = input;

    try {
      const app = await this.initApp({ companyUid });

      const user = app.auth().getUserByPhoneNumber(phone);

      return user;
    } catch (error) {
      return null;
    }
  }

  public async getUserByEmail(
    input: GetUserByEmailInput,
  ): Promise<firebaseAdmin.auth.UserRecord> {
    const { companyUid, email } = input;

    try {
      const app = await this.initApp({ companyUid });

      const user = app.auth().getUserByEmail(email);

      return user;
    } catch (error) {
      return null;
    }
  }

  public async updateUser(
    updateUserInput: UpdateUserInput,
  ): Promise<firebaseAdmin.auth.UserRecord> {
    const { companyUid } = updateUserInput;

    const app = await this.initApp({ companyUid });

    const { uid } = updateUserInput;

    const { phone, email, password, emailVerified } = updateUserInput;

    let updateRequest = {};
    if (email) updateRequest = { ...updateRequest, email };
    if (password) updateRequest = { ...updateRequest, password };
    if (phone) updateRequest = { ...updateRequest, phone };
    if (typeof emailVerified === 'boolean')
      updateRequest = { ...updateRequest, emailVerified };

    // console.log(updateRequest, 'updateRequest');

    return app.auth().updateUser(uid, updateRequest);
  }

  public async deleteUser(removeUserInput: GetUserByUid): Promise<void> {
    const { companyUid } = removeUserInput;

    const app = await this.initApp({ companyUid });

    const { uid } = removeUserInput;

    return app.auth().deleteUser(uid);
  }

  public async verifyToken(
    input: VerifyTokenInput,
  ): Promise<firebaseAdmin.auth.DecodedIdToken> {
    const { companyUid } = input;

    const app = await this.initApp({ companyUid });

    const { token } = input;
    const decodedToken = await app.auth().verifyIdToken(token);

    return decodedToken;
  }
}
