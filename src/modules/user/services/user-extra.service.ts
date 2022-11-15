import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigType } from '@nestjs/config';

import appConfig from '../../../config/app.config';

import { User } from '../user.entity';

import { TemplateType } from '../../email-template/email-template.entity';
import { VerificationCodeType } from '../../verification-code/verfication-code.entity';

import { UserService } from './user.service';
import { FirebaseAdminService } from '../../../plugins/firebase-admin/firebase-admin.service';
import { EmailTemplateService } from '../../email-template/email-template.service';
import { MailgunService } from '../../../plugins/mailgun/mailgun.service';
import { VerificationCodeService } from '../../verification-code/verification-code.service';
import { RoleService } from '../../role/role.service';
import { AssignedRoleService } from '../../assigned-role/assigned-role.service';
import { CompanyService } from '../../company/services/company.service';
import { FirebaseService } from '../../../plugins/firebase/firebase.service';

import { addDaysToDate } from '../../../utils';

import { ChangeUserPhoneInput } from '../dto/change-user-phone-input.dto';
import { ChangeUserEmailInput } from '../dto/change-user-email-input.dto';
import { ChangeUserPasswordInput } from '../dto/change-user-password-input.dto';
import { GetOneUserInput } from '../dto/get-one-user-input.dto';
import { ConfirmUserEmailInput } from '../dto/confirm-user-email-input.dto';
import { SendResetUserPasswordEmailInput } from '../dto/send-reset-user-password-input.dto';
import { VoidOutput } from '../dto/void-output.dto';
import { ResetUserPasswordInput } from '../dto/reset-user-password-input.dto';
import { ResetUserPasswordOutput } from '../dto/reset-user-password-output.dto';
import { CreateUsersFromFirebaseInput } from '../dto/create-users-from-firebase-input.dto';
import { AssignUserRoleInput } from '../dto/assign-user-role-input.dto';
import { CreateSuperAdmiUserInput } from '../dto/create-super-admin-user-input.dto';
import { LoginSuperAdminInput } from '../dto/login-super-admin-input.dto';
import { LoginSuperAdminOutput } from '../dto/login-super-admin-output.dto';
import { SendUserConfirmationEmailInput } from '../dto/send-user-confirmation-email-input.dto';
import { SendUserPasswordUpdatedEmailInput } from '../dto/send-user-password-updated-email-input.dto';
import { UnassignUserRoleInput } from '../dto/unassign-user-role-input.dto';
import { GetUsersByAuthUidsInput } from '../dto/get-users-by-auth-uids-input.dto';

@Injectable()
export class UserExtraService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly mailgunService: MailgunService,
    private readonly verificationCodeService: VerificationCodeService,
    private readonly roleService: RoleService,
    private readonly assignedRoleService: AssignedRoleService,
    private readonly companyService: CompanyService,
    private readonly firebaseService: FirebaseService,
  ) {}

  /* functions in charge of creating  */

  public async assignRole(input: AssignUserRoleInput): Promise<User> {
    const { userAuthUid, roleUid, companyUid, roleCode } = input;

    // get the user
    const exisitingUser = await this.userService.getOneByOneFields({
      fields: {
        authUid: userAuthUid,
      },
      checkIfExists: true,
    });

    // try to get the company if we have the company uid
    let company;
    if (companyUid) {
      company = await this.companyService.getOneByOneFields({
        fields: {
          uid: companyUid,
        },
        checkIfExists: true,
        loadRelationIds: false,
      });
    }

    // get the role
    const exisitingRole = await this.roleService.getOneByOneFields({
      fields: {
        uid: roleUid,
        company,
        code: roleCode,
      },
      checkIfExists: true,
    });

    // assign the role to the user
    await this.assignedRoleService.create({
      roleUid: exisitingRole.uid,
      userUid: exisitingUser.authUid,
    });

    return exisitingUser;
  }

  public createUsersFromFirebase(
    input: CreateUsersFromFirebaseInput,
  ): VoidOutput {
    const { companyUid, roleCode } = input;

    (async () => {
      const firebaseUsers = await this.firebaseAdminService.getUsers({
        companyUid,
      });

      for (const firebaseUser of firebaseUsers) {
        const { email, uid, phoneNumber } = firebaseUser;

        try {
          await this.userService.create({
            companyUid,
            authUid: uid,
            email,
            phone: phoneNumber,
            sendEmail: false,
            roleCode,
          });

          Logger.log(
            `user with auth uid ${uid} created.`,
            UserExtraService.name,
          );
        } catch (error) {
          console.error(error);
          Logger.error(
            `problems creating the user with auth uid ${uid}.`,
            UserExtraService.name,
          );
        }
      }
    })().catch((error) => console.error(error));

    return {
      message: 'processing...',
    };
  }

  public async createSuperAdminUser(
    input: CreateSuperAdmiUserInput,
  ): Promise<User> {
    // get the company
    const { companyUid } = input;

    const company = await this.companyService.getOneByOneFields({
      fields: { uid: companyUid },
      checkIfExists: true,
      loadRelationIds: false,
    });

    // check if the user already exists by email
    const { email } = input;

    let existing = await this.userService.getOneByOneFields({
      fields: {
        company,
        email,
      },
    });

    if (existing) {
      throw new ConflictException(`user with email ${email} already exists.`);
    }

    // check if the user already exists by phone
    const { phone } = input;

    existing = await this.userService.getOneByOneFields({
      fields: {
        phone,
        company,
      },
    });

    if (existing) {
      throw new ConflictException(`user with phone ${phone} already exists.`);
    }

    // create the user in firebase
    const { password } = input;

    const firebaseUser = await this.firebaseAdminService.createUser({
      companyUid,
      email,
      password,
      phone,
    });

    // create the user in the database
    const created = this.userRepository.create({
      authUid: firebaseUser.uid,
      email: firebaseUser.email,
      phone: firebaseUser.phoneNumber,
      company,
      isSuperAdmin: true,
    });

    // save the user in the database
    const saved = await this.userRepository.save(created);

    // send the confirmation email
    this.sendSuperAdminConfirmationEmail({
      authUid: saved.authUid,
    }).catch((error) => console.error(error));

    return saved;
  }

  /* functions in charge of creating  */

  /* functions in charge of reading  */

  public async getUsersByAuthUids(
    input: GetUsersByAuthUidsInput,
  ): Promise<User[]> {
    const { authUids } = input;

    const users = await this.userRepository
      .createQueryBuilder('user')
      .loadAllRelationIds()
      .where('user.authUid IN (:...authUids)', { authUids })
      .getMany();

    return users;
  }

  /* functions in charge of reading  */

  /* functions in charge of updating  */

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

    if (
      existingUserWithSamePhone &&
      existingUser.id !== existingUserWithSamePhone.id
    ) {
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

    const { emailTemplateParams = {} } = input;

    // send confirmation email
    this.sendConfirmationEmail(
      {
        authUid,
      },
      {
        emailTemplateParams,
      },
    ).catch((err) => console.error(err));

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

    // check if the old password is correct
    const { oldPassword } = input;

    const { company } = existingUser;

    try {
      await this.firebaseService.login({
        companyUid: company.uid,
        email: existingUser.email,
        password: oldPassword,
      });
    } catch (error) {
      throw new UnauthorizedException('the password is incorrect.');
    }

    const { newPassword } = input;

    // update the user in firebase
    await this.firebaseAdminService.updateUser({
      companyUid: company.uid,
      uid: authUid,
      password: newPassword,
    });

    // send a notification to the user
    const { emailTemplateParams = {} } = input;

    this.sendPasswordUpdatedEmail(
      {
        authUid,
      },
      {
        emailTemplateParams,
      },
    ).catch((error) => console.error(error));

    return existingUser;
  }

  /* functions in charge of updating  */

  /* functions in charge of deleting */

  public async unassignRole(input: UnassignUserRoleInput): Promise<User> {
    const { userAuthUid, roleUid, companyUid, roleCode } = input;

    // get the user
    const exisitingUser = await this.userService.getOneByOneFields({
      fields: {
        authUid: userAuthUid,
      },
      checkIfExists: true,
    });

    // try to get the company if we have the company uid
    let company;
    if (companyUid) {
      company = await this.companyService.getOneByOneFields({
        fields: {
          uid: companyUid,
        },
        checkIfExists: true,
        loadRelationIds: false,
      });
    }

    // get the role
    const exisitingRole = await this.roleService.getOneByOneFields({
      fields: {
        uid: roleUid,
        company,
        code: roleCode,
      },
      checkIfExists: true,
    });

    // assign the role to the user
    await this.assignedRoleService.delete({
      roleUid: exisitingRole.uid,
      userUid: exisitingUser.authUid,
    });

    return exisitingUser;
  }

  /* functions in charge of deleting */

  /* other functions */

  public async sendConfirmationEmail(
    getOneUserInput: GetOneUserInput,
    input?: SendUserConfirmationEmailInput,
  ): Promise<VoidOutput> {
    const { authUid } = getOneUserInput;

    // get the user and check if exists
    const existingUser = await this.userService.getOneByOneFields({
      fields: { authUid },
      relations: ['company'],
      checkIfExists: true,
    });

    // check the email
    const { email } = existingUser;

    if (!email) {
      throw new ConflictException('the user does not have email.');
    }

    // generate the verification code
    const verificationCode = await this.verificationCodeService.create({
      expirationDate: addDaysToDate(new Date(), 1),
      type: VerificationCodeType.CONFIRM_EMAIL,
      user: existingUser,
    });

    const { company } = existingUser;

    const { emailTemplateParams = {} } = input;

    // generate the html for the email
    const { html, subject } =
      await this.emailTemplateService.generateTemplateHtml({
        companyUid: company.uid,
        type: TemplateType.CONFIRMATION_EMAIL,
        parameters: {
          link:
            this.appConfiguration.app.selfApiUrl +
            'users/confirm-email?code=' +
            verificationCode.code,
          ...emailTemplateParams,
        },
      });

    // send the email
    await this.mailgunService.sendEmail({
      from: this.appConfiguration.mailgun.emailFrom,
      subject: subject || 'Please confirm your email',
      to: email,
      html,
    });

    return {
      message: 'an email has been sent.',
    };
  }

  public async sendSuperAdminConfirmationEmail(
    input: GetOneUserInput,
  ): Promise<VoidOutput> {
    const { authUid } = input;

    // get the user and check if exists
    const existingUser = await this.userService.getOneByOneFields({
      fields: { authUid },
      relations: ['company'],
      checkIfExists: true,
    });

    // check the email
    const { email } = existingUser;

    if (!email) {
      throw new ConflictException('the user does not have email.');
    }

    // generate the verification code
    const verificationCode = await this.verificationCodeService.create({
      expirationDate: addDaysToDate(new Date(), 1),
      type: VerificationCodeType.CONFIRM_EMAIL,
      user: existingUser,
    });

    const { company } = existingUser;

    // generate the html for the email
    const { html, subject } =
      await this.emailTemplateService.generateTemplateHtml({
        companyUid: company.uid,
        type: TemplateType.SUPER_ADMIN_CONFIRMATION_EMAIL,
        parameters: {
          firstName: email,
          companyName: company.name,
          link:
            this.appConfiguration.app.selfApiUrl +
            'users/confirm-email?code=' +
            verificationCode.code,
          accessKey: company.accessKey,
        },
      });

    // send the email
    await this.mailgunService.sendEmail({
      from: this.appConfiguration.mailgun.emailFrom,
      subject: subject || 'Please confirm your email',
      to: email,
      html,
    });

    return {
      message: 'an email has been sent.',
    };
  }

  public async confirmEmail(
    input: ConfirmUserEmailInput,
  ): Promise<{ url: string }> {
    const { code } = input;

    // validate and get the verification code
    const verificationCode = await this.verificationCodeService.validate({
      code,
      type: VerificationCodeType.CONFIRM_EMAIL,
    });

    const { user } = verificationCode;

    // get the company of the user
    const { company } = await this.userService.getOneByOneFields({
      fields: { id: user.id },
      relations: ['company'],
    });

    // update the user in firebase
    await this.firebaseAdminService.updateUser({
      companyUid: company.uid,
      uid: user.authUid,
      emailVerified: true,
    });

    // delete the verification code (that indicates that the verification has been used)
    await this.verificationCodeService.delete({
      uid: verificationCode.uid,
    });

    // determinate the url to redirect
    const urlToRedirect =
      company.website || this.appConfiguration.app.selfApiUrl;

    return {
      url: urlToRedirect,
    };
  }

  public async sendResetPasswordEmail(
    input: SendResetUserPasswordEmailInput,
  ): Promise<VoidOutput> {
    const { companyUid, email } = input;

    // get the user for the given email and company
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.company', 'company')
      .where('company.uid = :companyUid', { companyUid })
      .andWhere('user.email = :email', { email })
      .getOne();

    if (!existingUser) {
      throw new NotFoundException(
        `can't get a user with email ${email} for the company ${companyUid}.`,
      );
    }

    if (!existingUser.company) {
      throw new InternalServerErrorException('can not get company from user.');
    }

    // generate the verification code
    const verificationCode = await this.verificationCodeService.create({
      expirationDate: addDaysToDate(new Date(), 1),
      type: VerificationCodeType.RESET_PASSWORD,
      user: existingUser,
    });

    const { company } = existingUser;

    const link =
      this.appConfiguration.app.selftWebUrl +
      'change-forgotten-password?code=' +
      verificationCode.code;

    const { emailTemplateParams } = input;

    // generate the html for the email
    const { html, subject } =
      await this.emailTemplateService.generateTemplateHtml({
        companyUid: company.uid,
        parameters: {
          link,
          ...emailTemplateParams,
        },
        type: TemplateType.RESET_PASSWORD_EMAIL,
      });

    // send the email
    await this.mailgunService.sendEmail({
      from: this.appConfiguration.mailgun.emailFrom,
      subject: subject || 'Reset password!',
      to: email,
      html,
    });

    return {
      message: 'an email has been sent.',
    };
  }

  public async resetPassword(
    input: ResetUserPasswordInput,
  ): Promise<ResetUserPasswordOutput> {
    const { code } = input;

    // validate and get the verification code
    const verificationCode = await this.verificationCodeService.validate({
      code,
      type: VerificationCodeType.RESET_PASSWORD,
    });

    const { user } = verificationCode;

    // get the company of the user
    const { company } = await this.userService.getOneByOneFields({
      fields: { id: user.id },
      relations: ['company'],
    });

    const { password } = input;

    // update the user in firebase
    await this.firebaseAdminService.updateUser({
      companyUid: company.uid,
      uid: user.authUid,
      password,
    });

    // delete the verification code (that indicates that the verification has been used)
    await this.verificationCodeService.delete({
      uid: verificationCode.uid,
    });

    // notify the user
    const { emailTemplateParams } = input;

    this.sendPasswordUpdatedEmail(
      {
        authUid: user.authUid,
      },
      {
        emailTemplateParams,
      },
    ).catch((error) => console.error(error));

    // determinate the url to redirect
    const urlToRedirect =
      company.website || this.appConfiguration.app.selfApiUrl;

    // return the url to redirect
    return {
      url: urlToRedirect,
    };
  }

  public async sendPasswordUpdatedEmail(
    getOneUserInput: GetOneUserInput,
    input?: SendUserPasswordUpdatedEmailInput,
  ): Promise<VoidOutput> {
    const { authUid } = getOneUserInput;

    // get the user and check if exists
    const existingUser = await this.userService.getOneByOneFields({
      fields: { authUid },
      relations: ['company'],
      checkIfExists: true,
    });

    // generate the html for the email
    const { emailTemplateParams } = input;

    const { html, subject } =
      await this.emailTemplateService.generateTemplateHtml({
        companyUid: existingUser.company.uid,
        parameters: {
          ...emailTemplateParams,
        },
        type: TemplateType.PASSWORD_UPDATED_EMAIL,
      });

    const { email } = existingUser;

    // send the email
    await this.mailgunService.sendEmail({
      from: this.appConfiguration.mailgun.emailFrom,
      subject: subject || 'Your password has been updated', // TODO: use a parameter
      to: email,
      html,
    });

    return {
      message: 'an email has been sent.',
    };
  }

  public async loginSuperAdmin(
    input: LoginSuperAdminInput,
  ): Promise<LoginSuperAdminOutput> {
    const { companyUid, email, password } = input;

    const existingCompany = await this.companyService.getOneByOneFields({
      fields: { uid: companyUid },
      checkIfExists: true,
    });

    const user = await this.userService.getOneByOneFields({
      fields: { company: existingCompany, email, isSuperAdmin: true },
    });

    if (!user) {
      throw new NotFoundException(`user with email ${email}, not found.`);
    }

    const firebaseUser = await this.firebaseService.login({
      companyUid: existingCompany.uid,
      email,
      password,
    });

    const { token, authTime, issuedAtTime, expirationTime } =
      await firebaseUser.getIdTokenResult();

    const { accessKey } = existingCompany;

    return {
      companyUid: existingCompany.uid,
      accessKey,
      token,
      authTime,
      issuedAtTime,
      expirationTime,
    };
  }

  /* other functions */
}
