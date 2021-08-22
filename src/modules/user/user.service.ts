import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../common/base.service';

import { User } from './user.entity';

import { CompanyService } from '../company/company.service';
import { FirebaseAdminService } from 'src/plugins/firebase-admin/firebase-admin.service';

import { CreateUserInput } from './dto/create-user-input.dto';
import { GetOneUserInput } from './dto/get-one-user-input.dto';
import { GetAllUsersInput } from './dto/get-all-users-input.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly companyService: CompanyService,
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {
    super(userRepository);
  }

  // CRUD
  public async create(input: CreateUserInput): Promise<User> {
    const { companyUid } = input;

    const company = await this.companyService.getOne({
      uid: companyUid,
    });

    const { authUid } = input;

    if (authUid) {
      // check if the user already exists by authUid
      const existing = await this.getOneByOneFields({
        fields: {
          authUid,
          company,
        },
      });

      if (existing) {
        throw new ConflictException(
          `user with auth uid ${authUid} already exists.`,
        );
      }

      // get the user in firebase by authUid
      const firebaseUser = await this.firebaseAdminService.getUserByUid({
        companyUid,
        uid: authUid,
      });

      if (!firebaseUser) {
        throw new NotFoundException(
          `user with auth uid ${authUid} does not exist in firebase.`,
        );
      }

      const created = this.userRepository.create({
        authUid,
        email: firebaseUser.email,
        phone: firebaseUser.phoneNumber,
        company,
      });

      const saved = await this.userRepository.save(created);

      return saved;
    }

    // check if the user already exists by email
    const { email } = input;

    if (email) {
      const existing = await this.getOneByOneFields({
        fields: {
          email,
          company,
        },
      });

      if (existing) {
        throw new ConflictException(`user with email ${email} already exists.`);
      }
    }

    // check if the user already exists by phone
    const { phone } = input;

    if (phone) {
      const existing = await this.getOneByOneFields({
        fields: {
          phone,
          company,
        },
      });

      if (existing) {
        throw new ConflictException(`user with phone ${phone} already exists.`);
      }
    }

    const { password } = input;

    // create the user in firebase
    const createdFirebaseUser = await this.firebaseAdminService.createUser({
      companyUid,
      email,
      password,
      phone,
    });

    const created = this.userRepository.create({
      authUid: createdFirebaseUser.uid,
      email,
      phone,
      company,
    });

    const saved = await this.userRepository.save(created);

    return saved;
  }

  public async getOne(input: GetOneUserInput): Promise<User | undefined> {
    const { authUid } = input;

    const existing = await this.getOneByOneFields({
      fields: { authUid },
      checkIfExists: false,
    });

    return existing;
  }

  public async getAll(input: GetAllUsersInput): Promise<User[]> {
    const { companyUid, limit, skip, q } = input;

    const query = this.userRepository
      .createQueryBuilder('user')
      .loadAllRelationIds()
      .innerJoin('user.company', 'company')
      .where('company.uid = :companyUid', { companyUid });

    if (q)
      query.andWhere(
        'user.email ilike :q OR user.phone ilike :q OR role.authUid ilike :q',
        {
          q: `%${q}%`,
        },
      );

    query.limit(limit || 10).skip(skip);

    const items = await query.getMany();

    return items;
  }

  public async delete(input: GetOneUserInput): Promise<User> {
    const { authUid } = input;

    const existing = await this.getOneByOneFields({
      fields: { authUid },
      relations: ['company'],
      checkIfExists: true,
    });

    // delete the user in firebase
    try {
      await this.firebaseAdminService.deleteUser({
        companyUid: existing.company.uid,
        uid: authUid,
      });
    } catch (error) {
      console.error(error);
    }

    const clone = { ...existing };

    await this.userRepository.softRemove(existing);

    return clone as User;
  }
  // CRUD
}
