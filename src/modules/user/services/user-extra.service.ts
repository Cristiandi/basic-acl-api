import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
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

  public async sendConfirmationEmail(
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
    const html = await this.emailTemplateService.generateTemplateHtml({
      companyUid: company.uid,
      type: TemplateType.CONFIRMATION_EMAIL,
      parameters: {
        firstName: email,
        link:
          this.appConfiguration.app.selfApiUrl +
          'users/confirm-email?code=' +
          verificationCode.code,
      },
    });

    // send the email
    await this.mailgunService.sendEmail({
      from: this.appConfiguration.mailgun.emailFrom,
      subject: 'Please confirm your email',
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
      .innerJoin('company', 'company')
      .where('company.uid = :companyUid', { companyUid })
      .andWhere('user.email = :email', { email })
      .getOne();

    if (!existingUser) {
      throw new NotFoundException(
        `can't get a user with email ${email} for the company ${companyUid}.`,
      );
    }

    // generate the verification code
    const verificationCode = await this.verificationCodeService.create({
      expirationDate: addDaysToDate(new Date(), 1),
      type: VerificationCodeType.RESET_PASSWORD,
      user: existingUser,
    });

    // generate the html for the email
    const html = await this.emailTemplateService.generateTemplateHtml({
      companyUid,
      parameters: {
        link:
          this.appConfiguration.app.selfApiUrl +
          'change-forgotten-password?code=' +
          verificationCode.code,
      },
      type: TemplateType.RESET_PASSWORD_EMAIL,
    });

    // send the email
    await this.mailgunService.sendEmail({
      from: this.appConfiguration.mailgun.emailFrom,
      subject: 'Reset password!',
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

    // determinate the url to redirect
    const urlToRedirect =
      company.website || this.appConfiguration.app.selfApiUrl;

    return {
      url: urlToRedirect,
    };
  }
}
