import * as SparkMD5 from 'spark-md5';
import { Injectable, HttpException, HttpStatus, Logger, NotFoundException, forwardRef, Inject, ForbiddenException, UnauthorizedException, PreconditionFailedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'nestjs-redis';
import { ConfigType } from '@nestjs/config';

import appConfig from '../../config/app.config';

import { User } from './user.entity';

import { CompaniesService } from '../companies/companies.service';
import { FirebaseService } from '../../common/plugins/firebase/firebase.service';
import { FirebaseAdminService } from '../../common/plugins/firebase-admin/firebase-admin.service';
import { ParametersService } from '../parameters/parameters.service';
import { TemplatesService } from 'src/common/templates/templates.service';
import { MailerService } from 'src/common/plugins/mailer/mailer.service';
import { ConfirmationEmailConfigsService } from '../confirmation-email-configs/confirmation-email-configs.service';
import { VerificationCodesService } from '../verification-codes/verification-codes.service';
import { RolesService } from '../roles/roles.service';
import { AssignedRolesService } from '../assigned-roles/assigned-roles.service';

import { addDaysToDate } from '../../utils';

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
import { GetUserByTokenInput } from './dto/get-user-by-token-input.dto';
import { SendConfirmationEmailnput } from './dto/send-confirmation-email-input.dto';
import { ConfirmEmailInput } from './dto/confirm-email-input.dto';
import { SendForgottenPasswordEmailInput } from './dto/send-forgotten-password-email-input.dto';
import { ForgottenPasswordConfigsService } from '../forgotten-password-configs/forgotten-password-configs.service';
import { ChangeForgottenPasswordInput } from './dto/change-forgotten-password-input.dto';
import { SendUpdatedPasswordNotificationEmailInput } from './dto/send-updated-password-notification-email-input.dto';
import { LoginAdminOutPut } from './dto/login-admin-output.dto';
import { GetCompanyUserByEmailInput } from './dto/get-company-user-by-email-input.dto';
import { ChangePasswordInput } from './dto/change-password-input.dto';
import { ChangePhoneInput } from './dto/change-phone-input.dto';
import { MailgunService } from 'src/common/plugins/mailgun/mailgun.service';
import { ChangeEmailInput } from './dto/change-email-input.dto';
import { CreateUserAlreadyInFirebaseInput } from './dto/create-user-already-in-fireabse-input.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly companiesService: CompaniesService,
    private readonly firebaseService: FirebaseService,
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly parametersService: ParametersService,
    private readonly templatesService: TemplatesService,
    private readonly mailerService: MailerService,
    private readonly mailgunService: MailgunService,
    private readonly confirmationEmailConfigsService: ConfirmationEmailConfigsService,
    private readonly verificationCodesService: VerificationCodesService,
    private readonly forgottenPasswordConfigsService: ForgottenPasswordConfigsService,
    private readonly rolesService: RolesService,
    @Inject(forwardRef(() => AssignedRolesService))
    private readonly assignedRolesService: AssignedRolesService,
    private readonly redisService: RedisService
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

    const { roleCode } = createUserInput;

    if (roleCode) {
      const existingRole = await this.rolesService.getCompanyRoleByCode({ companyUuid, code: roleCode });

      if (!existingRole) {
        throw new NotFoundException(`can't get the role with code ${roleCode} for the company ${companyUuid}.`);
      }
    }

    const { email, password, phone } = createUserInput;

    const createdFirebaseUser = await this.firebaseAdminService.createUser({
      companyUuid,
      countryCode: company.countryCode,
      email,
      password,
      phone
    });

    const { anonymous = false } = createUserInput;

    const created = this.usersRepository.create({
      company,
      authUid: createdFirebaseUser.uid,
      email,
      isAdmin: false,
      anonymous
    });

    const saved = await this.usersRepository.save(created);

    if (company.confirmationEmailConfig) {
      this.sendConfirmationEmail({ companyUuid, email: saved.email })
        .catch(err => console.error(err));
    }

    if (roleCode) {
      this.assignedRolesService.assign({ companyUuid, roleCode, userEmail: saved.email })
        .catch(err => console.error(err));
    }

    delete saved.company;

    return saved;
  }

  public async createAlreadyInFirebase(
    createUserAlreadyInFirebase: CreateUserAlreadyInFirebaseInput
  ): Promise<User> {
    const { companyUuid } = createUserAlreadyInFirebase;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can not get the company with uuid ${company}`);
    }

    const { roleCode } = createUserAlreadyInFirebase;

    if (roleCode) {
      const existingRole = await this.rolesService.getCompanyRoleByCode({ companyUuid, code: roleCode });

      if (!existingRole) {
        throw new NotFoundException(`can't get the role with code ${roleCode} for the company ${companyUuid}.`);
      }
    }

    const { authUid } = createUserAlreadyInFirebase;

    // look for the user en firebase
    const firebaseUser = await this.firebaseAdminService.getUserByUid({
      companyUuid,
      uid: authUid
    });

    if (!firebaseUser) {
      throw new NotFoundException(`can't get the user with uid ${authUid} in fireabse.`);
    }

    // check if the user exists or not
    const existing = await this.getUserByAuthUid({
      authUid
    });

    if (existing) {
      delete existing.company;

      return existing;
    }

    // create the user
    const created = this.usersRepository.create({
      company,
      authUid: firebaseUser.uid,
      email: firebaseUser.email,
      emailVerified: firebaseUser.emailVerified
    });

    const saved = await this.usersRepository.save(created);

    if (roleCode) {
      this.assignedRolesService.assign({ companyUuid, roleCode, userEmail: saved.email })
        .catch(err => console.error(err));
    }

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
  public async findOne(findOneUserInput: FindOneUserInput): Promise<User | null> {
    const { id, companyUuid } = findOneUserInput;

    const existing = await this.usersRepository.createQueryBuilder('u')
      .innerJoinAndSelect('u.company', 'c')
      .where('u.id = :id', { id })
      .andWhere('c.uuid = :companyUuid', { companyUuid })
      .getOne();

    if (!existing) {
      return null;
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

    if (!existing) {
      const { id, companyUuid } = findOneUserInput;

      throw new NotFoundException(`can't get the user ${id} for the company with uuid ${companyUuid}.`);
    }

    if (existing.isAdmin) {
      throw new ForbiddenException('can\'t delete an admin user.');
    }

    const { authUid: uid, company: { uuid: companyUuid } } = existing;

    try {
      await this.firebaseAdminService.deleteUser({ companyUuid, uid });  
    } catch (error) {
      Logger.error(`Error deleting an user in firebase: ${error.message}`);
    }

    // TODO: delete all assigned roles for the user

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
  public async loginAdmin(loginUserInput: LoginUserInput): Promise<LoginAdminOutPut> {
    const { companyUuid } = loginUserInput;
    const { email, password } = loginUserInput;

    // get the client name
    const {
      redis: { clientName }
    } = this.appConfiguration;

    // get the redis client
    const redisClient = await this.redisService.getClient(clientName);

    // define the key
    const key = SparkMD5.hash(`${companyUuid}|${email}|${password}`);

    // try to get the key value
    const unParsedKeyValue = await redisClient.get(key);

    // if i get some value
    if (unParsedKeyValue) {
      // try to parse
      const parsedKeyValue = JSON.parse(unParsedKeyValue);

      return parsedKeyValue;
    }

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can't get the company with uuid ${companyUuid}.`);
    }

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
      throw new NotFoundException('the firebase user does not exists in the ACL database.');
    }

    if (!user.emailVerified) {
      throw new HttpException('the user does not have the email verified.', HttpStatus.PRECONDITION_FAILED);
    }

    if (!user.isAdmin) {
      throw new HttpException('the user is not an admin.', HttpStatus.PRECONDITION_FAILED);
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

    if (!unParsedKeyValue) {
      redisClient.set(key, JSON.stringify(response), 'EX', 3599);
    }

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

    this.sendConfirmationEmail({ companyUuid, email: saved.email });

    delete saved.company;

    return saved;
  }

  /**
   * function to get the user by yhe token
   *
   * @param {GetUserByTokenInput} getUserByTokenInput
   * @return {*}  {Promise<User>}
   * @memberof UsersService
   */
  public async getUserByToken(getUserByTokenInput: GetUserByTokenInput): Promise<User> {
    const { companyUuid, token } = getUserByTokenInput;
    
    let decodedToken;
    try {
      decodedToken = await this.firebaseAdminService.verifyToken({ companyUuid, token }); 
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    const { uid } = decodedToken;

    const user = await this.getUserByAuthUid({ authUid: uid });

    return user;
  }

  /**
   * function to send the mail to confirm the email address
   *
   * @param {SendConfirmationEmailnput} sendConfirmationEmailnput
   * @return {*}  {Promise<void>}
   * @memberof UsersService
   */
  public async sendConfirmationEmail(sendConfirmationEmailnput: SendConfirmationEmailnput): Promise<void> {
    const { companyUuid, email } = sendConfirmationEmailnput;

    const user = await this.usersRepository.createQueryBuilder('u')
      .innerJoin('u.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('u.email = :email', { email })
      .getOne();

    if (!user) {
      throw new NotFoundException(`can't get the user ${email} for the company ${companyUuid}.`);
    }

    if (user.anonymous) {
      return;
    }

    const { emailVerified } = user;

    if (emailVerified) {
      throw new HttpException(`already verified email for the user ${email}.`, HttpStatus.PRECONDITION_FAILED);
    }

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    const { confirmationEmailConfig: needConfirmationEmailConfig } = company;

    let confirmationEmailConfigForCompany;

    let subject;

    if (needConfirmationEmailConfig) {
      confirmationEmailConfigForCompany = await this.confirmationEmailConfigsService.getOneByCompany({ companyUuid });

      if (!confirmationEmailConfigForCompany) {
        throw new NotFoundException(`can't get the confirmation email config for the company ${companyUuid}.`);
      }

      subject = confirmationEmailConfigForCompany.subject;

    } else {
      subject = await this.parametersService.getParameterValue({ name: 'CONFIRMATION_EMAIL_SUBJECT' });
    }

    const companyLogoUrl = company.logoUrl || await this.parametersService.getParameterValue({ name: 'DEFAULT_COMPANY_LOGO_URL' });

    const fromEmail = await this.parametersService.getParameterValue({ name: 'FROM_EMAIL' });

    const selfApiUrl = await this.parametersService.getParameterValue({ name: 'SELF_API_URL' });

    const verificationCode = await this.verificationCodesService.create({
      expirationDate: addDaysToDate(new Date(), 1),
      type: 'CONFIRMATION_EMAIL',
      email: user.email
    });

    const paramsForTemplate = {
      companyLogoUrl,
      link: `${selfApiUrl}users/confirmation-email-code?companyUuid=${companyUuid}&code=${verificationCode.code}`
    };

    const html = await this.templatesService.generateHtmlByTemplate('confirmation-email', paramsForTemplate, [], false);
    
    await this.mailgunService.sendEmail({
      from: fromEmail,
      to: [user.email],
      html,
      subject
    });
  }

  /**
   * function to confirm the email basen in the code
   *
   * @param {ConfirmEmailInput} confirmEmailInput
   * @return {*} 
   * @memberof UsersService
   */
  public async confirmEmail(confirmEmailInput: ConfirmEmailInput): Promise<{ url: string }> {
    const { companyUuid, code } = confirmEmailInput;

    const verificationCode = await this.verificationCodesService.findOne({ code });

    if (!verificationCode) {
      throw new PreconditionFailedException(`the code ${code} is not valid.`);
    }

    const { email } = verificationCode;

    const user = await this.usersRepository.createQueryBuilder('u')
      .innerJoin('u.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('u.email = :email', { email })
      .getOne();

    if (!user) {
      throw new NotFoundException(`can't get the user for the core ${code}.`);
    }

    user.emailVerified = true;

    await this.usersRepository.save(user);

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    await this.firebaseAdminService.updateUser({
      companyUuid,
      countryCode: company.countryCode,
      uid: user.authUid,
      emailVerified: true
    });


    let redirectUrl = await this.parametersService.getParameterValue({ name: 'SELF_API_URL' });

    if (company.confirmationEmailConfig) {
      const confirmationEmailConfig = await this.confirmationEmailConfigsService.getOneByCompany({ companyUuid });
      if (confirmationEmailConfig) {
        redirectUrl = confirmationEmailConfig.redirectUrl;
      }
    }

    return {
      url: redirectUrl
    };
  }

  /**
   *
   *
   * @param {SendForgottenPasswordEmailInput} sendForgottenPasswordEmailInput
   * @return {*}  {Promise<void>}
   * @memberof UsersService
   */
  public async sendForgottentPasswordEmail(sendForgottenPasswordEmailInput: SendForgottenPasswordEmailInput): Promise<void> {
    const { companyUuid, email } = sendForgottenPasswordEmailInput;

    const user = await this.usersRepository.createQueryBuilder('u')
      .innerJoin('u.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('u.email = :email', { email })
      .getOne();

    if (!user) {
      throw new NotFoundException(`can't get the user ${email} for the company ${companyUuid}.`);
    }

    if (user.anonymous) {
      return;
    }

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    const { forgottenPasswordConfig } = company;

    let forgottenPasswordConfigForCompany;

    let subject;

    if (forgottenPasswordConfig) {
      forgottenPasswordConfigForCompany = await this.forgottenPasswordConfigsService.getOneByCompany({ companyUuid });

      if (!forgottenPasswordConfigForCompany) {
        throw new NotFoundException(`can't get the forgotten password config for the company ${companyUuid}.`);
      }

      subject = forgottenPasswordConfigForCompany.subject;
    } else {
      subject = await this.parametersService.getParameterValue({ name: 'FORGOTTEN_PASSOWRD_EMAIL_SUBJECT' });
    }

    const companyLogoUrl = company.logoUrl || await this.parametersService.getParameterValue({ name: 'DEFAULT_COMPANY_LOGO_URL' });

    const fromEmail = await this.parametersService.getParameterValue({ name: 'FROM_EMAIL' });

    const selfWebUrl = await this.parametersService.getParameterValue({ name: 'SELF_WEB_URL' });

    const verificationCode = await this.verificationCodesService.create({
      expirationDate: addDaysToDate(new Date(), 1),
      type: 'FORGOTTEN_PASSWORD_EMAIL',
      email: user.email
    });

    const paramsForTemplate = {
      companyLogoUrl,
      link: `${selfWebUrl}change-forgotten-password?companyUuid=${companyUuid}&code=${verificationCode.code}`
    };

    const html = await this.templatesService.generateHtmlByTemplate('forgotten-password-email', paramsForTemplate, [], false);

    await this.mailgunService.sendEmail({
      from: fromEmail,
      to: [user.email],
      html,
      subject
    });
  }

  /**
   *
   *
   * @private
   * @param {SendUpdatedPasswordNotificationEmailInput} sendUpdatedPasswordNotificationEmailInput
   * @memberof UsersService
   */
  private async sendUpdatedPasswordNotificationEmail(
    sendUpdatedPasswordNotificationEmailInput: SendUpdatedPasswordNotificationEmailInput
  ) {
    const { companyUuid } = sendUpdatedPasswordNotificationEmailInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can't get the compant with uuid ${companyUuid}.`);
    }

    const companyLogoUrl = company.logoUrl || await this.parametersService.getParameterValue({ name: 'DEFAULT_COMPANY_LOGO_URL' });

    const paramsForTemplate = {
      companyLogoUrl
    };

    const html = await this.templatesService.generateHtmlByTemplate('updated-password-notification', paramsForTemplate, [], false);

    const fromEmail = await this.parametersService.getParameterValue({ name: 'FROM_EMAIL' });

    const subject = await this.parametersService.getParameterValue({ name: 'UPDATED_PASSWORD_NOTIFICATION_EMAIL_SUBJECT' });

    const { email } = sendUpdatedPasswordNotificationEmailInput;

    await this.mailgunService.sendEmail({
      from: fromEmail,
      to: [email],
      html,
      subject
    });
  }

  /**
   *
   *
   * @param {ChangeForgottenPasswordInput} changeForgottenPasswordInput
   * @return {*}  {Promise<any>}
   * @memberof UsersService
   */
  public async changeForgottenPassword(changeForgottenPasswordInput: ChangeForgottenPasswordInput): Promise<any> {
    const { password, confirmedPassword } = changeForgottenPasswordInput;

    if (password !== confirmedPassword) {
      throw new HttpException('the passwords does not match.', HttpStatus.BAD_REQUEST);
    }

    const { companyUuid } = changeForgottenPasswordInput;

    const company = await this.companiesService.getCompanyByUuid({ uuid: companyUuid });

    if (!company) {
      throw new NotFoundException(`can't get the compant with uuid ${companyUuid}.`);
    }

    const { code } = changeForgottenPasswordInput;

    const verificationCode = await this.verificationCodesService.findOne({ code });

    if (!verificationCode) {
      throw new PreconditionFailedException(`the code ${code} is not valid.`);
    }

    let redirectUrl = await this.parametersService.getParameterValue({ name: 'SELF_WEB_URL' });

    const { forgottenPasswordConfig } = company;

    if (forgottenPasswordConfig) {
      const forgottenPasswordConfigForCompany = await this.forgottenPasswordConfigsService.getOneByCompany({ companyUuid });

      if (!forgottenPasswordConfigForCompany) {
        throw new NotFoundException(`can't get the forgotten password config for the company ${companyUuid}.`);
      }

      redirectUrl = forgottenPasswordConfigForCompany.redirectUrl;
    }

    const { email } = verificationCode;

    const user = await this.usersRepository.createQueryBuilder('u')
      .innerJoin('u.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('u.email = :email', { email })
      .getOne();

    this.firebaseAdminService.updateUser({
      companyUuid,
      countryCode: company.countryCode,
      uid: user.authUid,
      password
    });

    this.sendUpdatedPasswordNotificationEmail({ companyUuid, email: user.email });

    return {
      url: redirectUrl
    };
  }

  /**
   *
   *
   * @param {GetCompanyUserByEmailInput} getCompanyUserByEmailInput
   * @return {*}  {Promise<User>}
   * @memberof UsersService
   */
  public async getCompanyUserByEmail(getCompanyUserByEmailInput: GetCompanyUserByEmailInput): Promise<User | null> {
    const { companyUuid, email } = getCompanyUserByEmailInput;

    const user = await this.usersRepository.createQueryBuilder('u')
      .innerJoin('u.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('u.email = :email', { email })
      .getOne();
    
    if (!user) {
      return null;
    }

    return user;
  }

  /**
   *
   *
   * @param {ChangePasswordInput} changePasswordInput
   * @return {*}  {Promise<void>}
   * @memberof UsersService
   */
  public async changePassword(changePasswordInput: ChangePasswordInput): Promise<void> {
    const { companyUuid, email } = changePasswordInput;

    const existing = await this.usersRepository.createQueryBuilder('u')
      .innerJoinAndSelect('u.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('u.email = :email', { email })
      .getOne();

    if (!existing) {
      throw new NotFoundException(`can't get the user with email ${email} for the company ${companyUuid}.`);
    }

    if (existing.anonymous) {
      return;
    }

    const { oldPassword } = changePasswordInput;

    try {
      await this.firebaseService.login({ companyUuid, email, password: oldPassword });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }

    const { company: { countryCode } } = existing;
    const { newPassword } = changePasswordInput;

    await this.firebaseAdminService.updateUser({
      companyUuid,
      countryCode,
      uid: existing.authUid,
      password: newPassword
    });

    this.sendUpdatedPasswordNotificationEmail({
      companyUuid,
      email
    }).catch(err => console.error(err));
  }

  /**
   *
   *
   * @param {ChangePhoneInput} changePhoneInput
   * @return {*}  {Promise<User>}
   * @memberof UsersService
   */
  public async changePhone(changePhoneInput: ChangePhoneInput): Promise<User> {
    const { companyUuid, email } = changePhoneInput;

    const existing = await this.usersRepository.createQueryBuilder('u')
      .innerJoinAndSelect('u.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('u.email = :email', { email })
      .getOne();

    if (!existing) {
      throw new NotFoundException(`can't get the user with email ${email} for the company ${companyUuid}.`);
    }

    if (existing.anonymous) {
      return existing;
    }

    const { company: { countryCode }, authUid } = existing;
    const { phone } = changePhoneInput;

    await this.firebaseAdminService.updateUser({
      companyUuid,
      countryCode,
      uid: authUid,
      phone
    });

    return existing;
  }

  public async changeEmail(changeEmailInput: ChangeEmailInput): Promise<User> {
    const { companyUuid, phone } = changeEmailInput;

    const company = await this.companiesService.getCompanyByUuid({
      uuid: companyUuid
    });

    const existingFirebaseUser = await this.firebaseAdminService.getUserByPhone({
      companyUuid,
      countryCode: company.countryCode,
      phone
    });

    if (!existingFirebaseUser) {
      throw new NotFoundException(`can't get the user in firebase with the phone ${phone} for the company ${companyUuid}.`);
    }

    const existing = await this.usersRepository.createQueryBuilder('u')
      .innerJoin('u.company', 'c')
      .where('c.uuid = :companyUuid', { companyUuid })
      .andWhere('u.auth_uid = :authUid', { authUid: existingFirebaseUser.uid })
      .getOne();

    if (!existing) {
      throw new NotFoundException(`can't get the user with the auth_uid ${existingFirebaseUser.uid} for the company ${companyUuid}.`);
    }

    const { email } = changeEmailInput;

    // if has the same email is not needed
    if (email === existing.email) {
      delete existing.company;
      return existing;
    }

    // update the email in firebase
    await this.firebaseAdminService.updateUser({
      companyUuid,
      countryCode: company.countryCode,
      uid: existingFirebaseUser.uid,
      email,
      emailVerified: false
    });

    // update the email in bd
    const preloaded = await this.usersRepository.preload({
      id: existing.id,
      email,
      emailVerified: false
    });

    const saved = await this.usersRepository.save(preloaded);

    delete saved.company;

    // send the confirmation email
    this.sendConfirmationEmail({
      companyUuid,
      email: saved.email
    }).catch(err => console.error(err));

    return saved;
  }
}
