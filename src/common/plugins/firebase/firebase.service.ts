import { Injectable, Scope } from '@nestjs/common';
import firebase from 'firebase';

import { CompaniesService } from 'src/modules/companies/companies.service';

import { InitFirebaseInput } from './dto/init-firebase-input.dto';
import { LoginInput } from './dto/login-input.dto';

@Injectable({ scope: Scope.DEFAULT })
export class FirebaseService {
  constructor(private readonly companiesService: CompaniesService) { }

  private async initFirebase(initFirebaseInput: InitFirebaseInput): Promise<firebase.app.App> {
    const { uuid } = initFirebaseInput;
    const firebaseConfig = await this.companiesService.getFirebaseConfig({ uuid });

    if (!firebase.apps.length) {
      const app = firebase.initializeApp(firebaseConfig);    
      return app;
    }

    const existingApp = firebase.apps.find(app => app.name === uuid);
    if (existingApp) return existingApp;

    const app = firebase.initializeApp(firebaseConfig, uuid);
    return app;
  }

  public async login(loginInput: LoginInput): Promise<firebase.User> {
    const { companyUuid } = loginInput;

    const firebaseApp = await this.initFirebase({ uuid: companyUuid });

    const { email, password } = loginInput;

    const result = await firebaseApp.auth().signInWithEmailAndPassword(email, password);

    // await firebaseApp.delete();

    return result.user;
  }
}
