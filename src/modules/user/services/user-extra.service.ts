import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseAdminService } from 'src/plugins/firebase-admin/firebase-admin.service';
import { Repository } from 'typeorm';

import { User } from '../user.entity';

import { UserService } from './user.service';

import { ChangeUserPhoneInput } from '../dto/change-user-phone-input.dto';
import { ChangeUserEmailInput } from '../dto/change-user-email-input.dto';
import { ChangeUserPasswordInput } from '../dto/change-user-password-input.dto';

@Injectable()
export class UserExtraService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  public async changePhone(input: ChangeUserPhoneInput): Promise<User> {
    const { authUid } = input;

    // get the user
    const existingUser = await this.userService.getOneByOneFields({
      fields: {
        authUid,
      },
      relations: ['company'],
      checkIfExists: true,
    });

    const { company } = existingUser;
    const { phone } = input;

    // check if the user exists with the given phone and for the same company
    const existingUserWithSamePhone = await this.userService.getOneByOneFields({
      fields: {
        phone,
        company,
      },
    });

    if (existingUserWithSamePhone) {
      throw new ConflictException(`the phone ${phone} it's already used.`);
    }

    // update the user in firebase
    await this.firebaseAdminService.updateUser({
      companyUid: company.uid,
      uid: authUid,
      phone,
    });

    // update the user in the database
    const preloaded = await this.userRepository.preload({
      id: existingUser.id,
      phone,
    });

    const saved = await this.userRepository.save(preloaded);

    return {
      ...saved,
      company,
    } as User;
  }

  public async changeEmail(input: ChangeUserEmailInput): Promise<User> {
    const { authUid } = input;

    // get the user
    const existingUser = await this.userService.getOneByOneFields({
      fields: {
        authUid,
      },
      relations: ['company'],
      checkIfExists: true,
    });

    const { company } = existingUser;
    const { email } = input;

    // check if the user exists with the given email and for the same company
    const existingUserWithSameEmail = await this.userService.getOneByOneFields({
      fields: {
        email,
        company,
      },
    });

    if (existingUserWithSameEmail) {
      throw new ConflictException(`the email ${email} it's already used.`);
    }

    // update the user in firebase
    await this.firebaseAdminService.updateUser({
      companyUid: company.uid,
      uid: authUid,
      email,
      emailVerified: false,
    });

    // update the user in the database
    const preloaded = await this.userRepository.preload({
      id: existingUser.id,
      email,
    });

    const saved = await this.userRepository.save(preloaded);

    // TODO: send a notification to the user
    // TODO: send confirmation email

    return {
      ...saved,
      company,
    } as User;
  }

  public async changePassword(input: ChangeUserPasswordInput): Promise<User> {
    const { authUid } = input;

    // get the user
    const existingUser = await this.userService.getOneByOneFields({
      fields: {
        authUid,
      },
      relations: ['company'],
      checkIfExists: true,
    });

    const { oldPassword } = input;

    // TODO: check if the old password is correct
    Logger.log(
      `remenber to check the old password ${oldPassword}`,
      UserExtraService.name,
    );

    const { company } = existingUser;
    const { newPassword } = input;

    // update the user in firebase
    await this.firebaseAdminService.updateUser({
      companyUid: company.uid,
      uid: authUid,
      password: newPassword,
    });

    // TODO: send a notification to the user

    return existingUser;
  }
}
