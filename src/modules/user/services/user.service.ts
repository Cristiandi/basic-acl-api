import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { auth } from 'firebase-admin';

import { BaseService } from '../../../common/base.service';

import { User } from '../user.entity';
import { Role } from '../../role/role.entity';

import { CompanyService } from '../../company/services/company.service';
import { FirebaseAdminService } from '../../../plugins/firebase-admin/firebase-admin.service';
import { UserExtraService } from './user-extra.service';
import { RoleService } from '../../role/role.service';

import { CreateUserInput } from '../dto/create-user-input.dto';
import { GetOneUserInput } from '../dto/get-one-user-input.dto';
import { GetAllUsersInput } from '../dto/get-all-users-input.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userExtraService: UserExtraService,
    private readonly companyService: CompanyService,
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly roleService: RoleService,
  ) {
    super(userRepository);
  }

  // CRUD
  public async create(input: CreateUserInput): Promise<User> {
    const { companyUid } = input;

    const company = await this.companyService.getOneByOneFields({
      fields: { uid: companyUid },
      checkIfExists: true,
    });

    const { roleCode } = input;

    let role: Role;

    if (roleCode) {
      role = await this.roleService.getOneByOneFields({
        fields: {
          company,
          code: roleCode,
        },
      });
    }

    const { authUid } = input;

    let firebaseUser: auth.UserRecord;

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
      firebaseUser = await this.firebaseAdminService.getUserByUid({
        companyUid,
        uid: authUid,
      });

      if (!firebaseUser) {
        throw new NotFoundException(
          `user with auth uid ${authUid} does not exist in firebase.`,
        );
      }
    } else {
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
          throw new ConflictException(
            `user with email ${email} already exists.`,
          );
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
          throw new ConflictException(
            `user with phone ${phone} already exists.`,
          );
        }
      }

      const { password } = input;

      // create the user in firebase
      firebaseUser = await this.firebaseAdminService.createUser({
        companyUid,
        email,
        password,
        phone,
      });
    }

    // create the user
    const created = this.userRepository.create({
      authUid: firebaseUser.uid,
      email: firebaseUser.email,
      phone: firebaseUser.phoneNumber,
      company,
    });

    // save the user in the database
    const saved = await this.userRepository.save(created);

    // decide if need to assign the role
    if (role) {
      try {
        await this.userExtraService.assignRole({
          roleUid: role.uid,
          userAuthUid: saved.authUid,
        });
      } catch (error) {
        Logger.error(
          `error assigning the role ${role.uid} to the user ${saved.authUid}.`,
          UserService.name,
        );
        Logger.log('deleting that user...');
        await this.delete({
          authUid: saved.authUid,
        });
      }
    }

    const { sendEmail = true, emailTemplateParams = {} } = input;

    // decide if need to send an email to the user
    if (sendEmail && saved.email) {
      // send the confirmation email
      this.userExtraService
        .sendConfirmationEmail(
          {
            authUid: saved.authUid,
          },
          {
            emailTemplateParams,
          },
        )
        .catch((error) => console.error(error));
    }

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

  public getByIds(ids: number[]): Promise<User[]> {
    return this.userRepository.find({
      where: {
        id: In(ids),
      },
      loadRelationIds: true,
    });
  }

  public async assignedRoles(parent: User): Promise<any[]> {
    const { id } = parent;

    const master = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.assignedRoles', 'assignedRoles')
      .leftJoinAndSelect('assignedRoles.role', 'role')
      .where('user.id = :id', { id })
      .getOne();

    const items = master ? master.assignedRoles : [];

    return items.map((item) => ({ ...item, user: master.id }));
  }
}
