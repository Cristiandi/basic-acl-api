import { Injectable, Scope } from '@nestjs/common';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, User } from 'firebase/auth';

import { CompanyExtraService } from '../../modules/company/services/company-extra.service';

import { InitFirebaseInput } from './dto/init-firebase-input.dto';
import { LoginInput } from './dto/login-input.dto';

@Injectable({ scope: Scope.DEFAULT })
export class FirebaseService {
  private appsPool: Map<string, FirebaseApp>;

  constructor(private readonly companyExtraService: CompanyExtraService) {
    this.appsPool = new Map<string, FirebaseApp>();
  }

  private async initFirebase(
    initFirebaseInput: InitFirebaseInput,
  ): Promise<FirebaseApp> {
    const { uid } = initFirebaseInput;

    const appInPool = this.appsPool.get(uid);

    if (appInPool) return appInPool;

    const firebaseConfig = await this.companyExtraService.getFirebaseConfig({
      uid: uid,
    });

    const existingApp = this.appsPool.get(uid);

    if (existingApp) return existingApp;

    const app = initializeApp(firebaseConfig, uid);

    this.appsPool.set(uid, app);

    return app;
  }

  public async login(loginInput: LoginInput): Promise<User> {
    const { companyUid } = loginInput;

    const firebaseApp = await this.initFirebase({ uid: companyUid });

    const auth = getAuth(firebaseApp);

    const { email, password } = loginInput;

    const { user } = await signInWithEmailAndPassword(auth, email, password);

    return user;
  }
}
