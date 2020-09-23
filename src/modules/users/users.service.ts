import { Injectable, HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entitty';

import { CompaniesService } from '../companies/companies.service';
import { FirebaseService } from '../../common/plugins/firebase/firebase.service';
import { FirebaseAdminService } from '../../common/plugins/firebase-admin/firebase-admin.service';

import { LoginUserInput } from './dto/login-user-input-dto';
import { CreateUsersFromFirebaseInput } from './dto/create-users-from-firebase-input.dto';
import { CreateUserFromFirebaseInput } from './dto/create-user-from-firebase-input.dto';
import { GetUserByAuthUidInput } from './dto/get-user-by-auth-uid-input.dto';
import { FindOneUserInput } from './dto/find-one-user-input.dto';
import { UpdateUserInput } from './dto/update-user-input.dto';
import { FindAllUsersParamInput } from './dto/find-all-users-param-input.dto';
import { FindAllUsersQueryInput } from './dto/find-all-users-query-input.dto';
import { CreateUserInput } from './dto/create-user-input.dto';
import { CreateCompanyAdminInput } from './dto/create-company-admin-input.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly companiesService: CompaniesService,
    private readonly firebaseService: FirebaseService,
    private readonly firebaseAdminService: FirebaseAdminService
  ) { }

  /**
   * function to create an user for a company
   *
   * @param {CreateUserInput} createUserInput
   * @returns {Promise<User>}
   * @memberof UsersService
   */
  public async create(createUserInput: CreateUserInput): Promise<User> {
    const { companyUuid } = createUserInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can not get the company with uuid ${company}`);
    }

    const { email, password, phone } = createUserInput;

    const createdFirebaseUser = await this.firebaseAdminService.createUser({
      companyUuid,
      countryCode: company.countryCode,
      email,
      password,
      phone
    });

    const created = this.usersRepository.create({
      company,
      authUid: createdFirebaseUser.uid,
      email,
      isAdmin: false
    });

    const saved = await this.usersRepository.save(created);

    delete saved.company;

    return saved;
  }

  /**
   * function to get the users of one company
   *
   * @param {FindAllUsersParamInput} findAllUsersParamInput
   * @param {FindAllUsersQueryInput} findAllUsersQueryInput
   * @returns {Promise<User[]>}
   * @memberof UsersService
   */
  public async findAll(
    findAllUsersParamInput: FindAllUsersParamInput,
    findAllUsersQueryInput: FindAllUsersQueryInput
  ): Promise<User[]> {
    const { companyUuid } = findAllUsersParamInput;
    const { limit = 0, offset = 0 } = findAllUsersQueryInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can not get the company with uuid ${company}`);
    }

    return this.usersRepository.find({
      select: ['id', 'authUid', 'email', 'isAdmin'],
      where: {
        company
      },
      take: limit || undefined,
      skip: offset,
      order: {
        id: 'DESC'
      }
    });
  }

  /**
   * function to find one user
   *
   * @param {FindOneUserInput} findOneUserInput
   * @returns {Promise<User>}
   * @memberof UsersService
   */
  public async findOne(findOneUserInput: FindOneUserInput): Promise<User> {
    const { companyUuid } = findOneUserInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can not get the company with uuid ${companyUuid}.`);
    }

    const { id } = findOneUserInput;
    const existing = await this.usersRepository.findOne(id, {
      where: {
        company
      },
      relations: ['company']
    });

    if (!existing) {
      throw new NotFoundException(`user ${id} not found`);
    }

    return existing;
  }

  /**
   * function to update a user
   *
   * @param {FindOneUserInput} findOneUserInput
   * @param {UpdateUserInput} updateUserInput
   * @returns {Promise<User>}
   * @memberof UsersService
   */
  public async update(
    findOneUserInput: FindOneUserInput,
    updateUserInput: UpdateUserInput
  ): Promise<User> {
    const { id, companyUuid } = findOneUserInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can not get the company with uuid ${companyUuid}.`);
    }

    const existing = await this.usersRepository.preload({
      id: +id,
      ...updateUserInput
    });

    if (!existing) {
      throw new NotFoundException(`user ${id} not found.`);
    }

    const { email, phone, password } = updateUserInput;

    await this.firebaseAdminService.updateUser({
      companyUuid,
      countryCode: company.countryCode,
      uid: existing.authUid,
      email,
      phone,
      password
    });

    return this.usersRepository.save(existing);
  }

  /**
   * function to delete a user
   *
   * @param {FindOneUserInput} findOneUserInput
   * @returns {Promise<User>}
   * @memberof UsersService
   */
  public async remove(findOneUserInput: FindOneUserInput): Promise<User> {
    const existing = await this.findOne(findOneUserInput);

    const { authUid: uid, company: { uuid: companyUuid } } = existing;

    await this.firebaseAdminService.deleteUser({ companyUuid, uid });

    const removed = await this.usersRepository.remove(existing);

    delete removed.company;

    return removed;
  }

  /**
   * function to login a user
   *
   * @param {LoginUserInput} loginUserInput
   * @returns {Promise<any>}
   * @memberof UsersService
   */
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

  /**
   * function to the get a user by the authUid attribute
   *
   * @param {GetUserByAuthUidInput} getUserByAuthUidInput
   * @returns {(Promise<User | null>)}
   * @memberof UsersService
   */
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

  /**
   * function to create a user from a firebaso user
   * process: creation_of_users_from_firebase
   *
   * @private
   * @param {CreateUserFromFirebaseInput} createUserFromFirebaseInput
   * @returns
   * @memberof UsersService
   */
  private async createUserFromFirebase(createUserFromFirebaseInput: CreateUserFromFirebaseInput) {
    const { companyUuid } = createUserFromFirebaseInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can not get the company with uuid ${company}`);
    }

    const { authUid, email } = createUserFromFirebaseInput;

    const created = this.usersRepository.create({
      company,
      authUid,
      email,
      isAdmin: false
    });

    return this.usersRepository.save(created);
  }

  /**
   * function to "import" the users from firebase
   * process: creation_of_users_from_firebase
   *
   * @param {CreateUsersFromFirebaseInput} createUsersFromFirebaseInput
   * @returns {Promise<{ message: string }>}
   * @memberof UsersService
   */
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

  /**
   * function to create an admin user for the company
   *
   * @param {CreateCompanyAdminInput} createCompanyAdminInput
   * @returns {Promise<User>}
   * @memberof UsersService
   */
  public async createCompanyAdmin(createCompanyAdminInput: CreateCompanyAdminInput): Promise<User> {
    const { companyUuid } = createCompanyAdminInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can not get the company with uuid ${company}`);
    }

    const existingAdmin = await this.usersRepository.find({
      where: {
        company,
        isAdmin: true
      }
    });

    if (existingAdmin.length) {
      throw new HttpException(`company ${companyUuid} already has an admin user.`, HttpStatus.PRECONDITION_FAILED);
    }

    const created = await this.create({
      companyUuid,
      email: createCompanyAdminInput.email,
      password: createCompanyAdminInput.password,
      phone: createCompanyAdminInput.phone
    });

    const existing = await this.usersRepository.preload({
      id: created.id,
      ...created,
      isAdmin: true
    });

    const saved = await this.usersRepository.save(existing);

    delete saved.company;

    return saved;
  }
}
