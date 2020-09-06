import { Injectable, HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entitty';

import { CompaniesService } from '../companies/companies.service';
import { FirebaseService } from 'src/common/plugins/firebase/firebase.service';
import { FirebaseAdminService } from 'src/common/plugins/firebase-admin/firebase-admin.service';

import { LoginUserInput } from './dto/login-user-input-dto';
import { CreateUsersFromFirebaseInput } from './dto/create-users-from-firebase-input.dto';
import { CreateUserFromFirebaseInput } from './dto/create-user-from-firebase-input.dto';
import { GetUserByAuthUidInput } from './dto/get-user-by-auth-uid-input.dto';
import { SetUserAsAdminInput } from './dto/set-user-as-admin-input.dto';
import { FindOneUserInput } from './dto/find-one-user-input.dto';
import { UpdateUserInput } from './dto/update-user-input.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly companiesService: CompaniesService,
    private readonly firebaseService: FirebaseService,
    private readonly firebaseAdminService: FirebaseAdminService
  ) { }

  public async findOne(findOneUserInput: FindOneUserInput): Promise<User> {
    const { id } = findOneUserInput;
    const existing = await this.usersRepository.findOne(id);

    if (!existing) {
      throw new NotFoundException(`user ${id} not found`);
    }

    return existing;
  }

  async update(findOneUserInput: FindOneUserInput, updateUserInput: UpdateUserInput): Promise<User> {
    const { id } = findOneUserInput;

    const existing = await this.usersRepository.preload({
      id: +id,
      ...updateUserInput
    });

    if (!existing) {
      throw new NotFoundException(`user ${id} not found`);
    }

    const compareTo = await this.usersRepository.find({
      where: {
        email: existing.email
      }
    });

    if (compareTo.length) {
      const [itemToCompare] = compareTo;

      if (itemToCompare.id !== existing.id) {
        throw new HttpException('other user already have the email,', 412);
      }
    }

    return this.usersRepository.save(existing);
  }

  public async loginUser(loginUserInput: LoginUserInput): Promise<any> {
    const { companyName } = loginUserInput;

    const company = await this.companiesService.getCompanyByName({ name: companyName });

    const { email, password } = loginUserInput;

    let firebaseUser;

    try {
      firebaseUser = await this.firebaseService.login({
        companyUuid: company.uuid,
        email,
        password
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }

    const user = await this.getUserByAuthUid({ authUid: firebaseUser.uid });

    if (!user) {
      throw new HttpException('the firebase user does not exists in the ACL database.', HttpStatus.PRECONDITION_FAILED);
    }

    const idTokenResult = await firebaseUser.getIdTokenResult();

    const response = {
      companyUuid: company.uuid,
      id: user.id,
      authUid: user.authUid,
      email: user.email,
      phone: firebaseUser.phoneNumber,
      accessToken: idTokenResult.token,
      authTime: new Date(idTokenResult.authTime).getTime(),
      expirationTime: new Date(idTokenResult.expirationTime).getTime()
    };

    return response;
  }

  public async getUserByAuthUid(getUserByAuthUidInput: GetUserByAuthUidInput): Promise<User | null> {
    const { authUid } = getUserByAuthUidInput;

    const data = await this.usersRepository.find({
      where: {
        authUid
      }
    });

    if (!data.length) return null;

    const [user] = data;

    return user;
  }

  private async createUserFromFirebase(createUserFromFirebaseInput: CreateUserFromFirebaseInput) {
    const { companyUuid } = createUserFromFirebaseInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    const { authUid, email } = createUserFromFirebaseInput;

    const created = this.usersRepository.create({
      company,
      authUid,
      email,
      isAdmin: false
    });

    return this.usersRepository.save(created);
  }

  public async createUsersFromFirebase(createUsersFromFirebaseInput: CreateUsersFromFirebaseInput): Promise<{ message: string }> {
    (async () => {
      const { companyUuid } = createUsersFromFirebaseInput;
      const firebaseUsers = await this.firebaseAdminService.getUsers({ companyUuid });

      for (const firebaseUser of firebaseUsers) {
        const { uid: authUid } = firebaseUser;

        const existingUser = await this.getUserByAuthUid({ authUid });

        if (existingUser) {
          Logger.debug(`user ${authUid} already exists.`);
          continue;
        }

        const { email } = firebaseUser;

        await this.createUserFromFirebase({
          companyUuid,
          authUid,
          email
        });

        Logger.debug(`user ${authUid} created!`);
      }
    })()
      .catch(err => console.error(err));

    return {
      message: 'accepted.'
    };
  }

  public async setUserAsAdmin(setUserAsAdminInput: SetUserAsAdminInput): Promise<User> {
    const { companyUuid, email } = setUserAsAdminInput;

    const existing = await this.usersRepository.createQueryBuilder('u')
      .innerJoin('u.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('u.email = :email', { email })
      .andWhere('u.isAdmin = true')
      .getOne();

    if (existing) {
      throw new HttpException('the company already has an admin.', HttpStatus.PRECONDITION_FAILED);
    }

    const target = await this.usersRepository.createQueryBuilder('u')
      .innerJoin('u.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('u.email = :email', { email })
      .getOne();

    if (!target) {
      throw new NotFoundException(`can't get the user with email ${email} and for the company ${companyUuid}.`);
    }

    const updated = await this.update({ id: '' + target.id }, { isAdmin: true });

    return updated;
  }
}
