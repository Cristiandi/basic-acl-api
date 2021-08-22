import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import appConfig from '../../../config/app.config';

import { User } from '../user.entity';

import { TemplateType } from '../../email-template/email-template.entity';
import { VerificationCodeType } from '../../verification-code/verfication-code.entity';

import { UserService } from './user.service';
import { FirebaseAdminService } from '../../../plugins/firebase-admin/firebase-admin.service';
import { EmailTemplateService } from '../../email-template/email-template.service';
import { MailgunService } from '../../../plugins/mailgun/mailgun.service';

import { addDaysToDate } from '../../../utils';

import { ChangeUserPhoneInput } from '../dto/change-user-phone-input.dto';
import { ChangeUserEmailInput } from '../dto/change-user-email-input.dto';
import { ChangeUserPasswordInput } from '../dto/change-user-password-input.dto';
import { GetOneUserInput } from '../dto/get-one-user-input.dto';
import { ConfigType } from '@nestjs/config';
import { VerificationCodeService } from 'src/modules/verification-code/verification-code.service';
import { ConfirmUserEmailInput } from '../dto/confirm-user-email-input.dto';

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

  public async sendConfirmationEmail(input: GetOneUserInput): Promise<void> {
    const { authUid } = input;

    // get the user and check if exists
    const existingUser = await this.userService.getOneByOneFields({
      fields: { authUid },
      checkIfExists: true,
    });

    // check the email
    const { email } = existingUser;

    if (!email) {
      throw new ConflictException('the user does not have email.');
    }

    // TODO: generate the verification code
    const verificationCode = await this.verificationCodeService.create({
      expirationDate: addDaysToDate(new Date(), 1),
      type: VerificationCodeType.CONFIRMATE_EMAIL,
      user: existingUser,
    });

    // generate the html for the email
    const html = await this.emailTemplateService.generateTemplateHtml({
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
  }

  public async confirmEmail(
    input: ConfirmUserEmailInput,
  ): Promise<{ url: string }> {
    const { code } = input;

    const verificationCode = await this.verificationCodeService.validate({
      code,
    });

    const { user } = verificationCode;

    const { company } = await this.userService.getOneByOneFields({
      fields: { id: user.id },
      relations: ['company'],
    });

    await this.verificationCodeService.delete({
      uid: verificationCode.uid,
    });

    const urlToRedirect =
      company.website || this.appConfiguration.app.selfApiUrl;

    await this.firebaseAdminService.updateUser({
      companyUid: company.uid,
      uid: user.authUid,
      emailVerified: true,
    });

    return {
      url: urlToRedirect,
    };
  }
}
