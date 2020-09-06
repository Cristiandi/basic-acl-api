import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from './user.entitty';

import { LoginUserInput } from './dto/login-user-input-dto';
import { CompaniesService } from '../companies/companies.service';
import { FirebaseService } from 'src/common/plugins/firebase/firebase.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly u: Repository<User>,
    private readonly companiesService: CompaniesService,
    private readonly firebaseService: FirebaseService
  ) {}

  public async loginUser(loginUserInput: LoginUserInput): Promise<any> {
    const { companyName } = loginUserInput;

    const company = await this.companiesService.getCompanyByName({ name: companyName });

    const { email, password } = loginUserInput;

    try {
      const firebaseUser = await this.firebaseService.login({
        companyUuid: company.uuid,
        email,
        password
      });

      const idTokenResult = await firebaseUser.getIdTokenResult();

      const response = {
        companyUuid: company.uuid,
        id: null,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        phone: firebaseUser.phoneNumber,
        accessToken: idTokenResult.token,
        authTime: new Date(idTokenResult.authTime).getTime(),
        expirationTime: new Date(idTokenResult.expirationTime).getTime()
      };
  
      return response;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
