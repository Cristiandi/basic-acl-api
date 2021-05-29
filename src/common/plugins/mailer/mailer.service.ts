import * as nodemailer from 'nodemailer';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import appConfig from 'src/config/app.config';

import { ParametersService } from 'src/modules/parameters/parameters.service';
import { Attachment } from 'nodemailer/lib/mailer';


@Injectable()
export class MailerService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    private readonly parametersService: ParametersService
  ) {}


  private async createAccount(): Promise<nodemailer.TestAccount> {
    const account = await nodemailer.createTestAccount();

    return account;
  }

  private async createTransport(useTest = false) {

    let account: nodemailer.TestAccount;
    if (useTest) {
      account = await this.createAccount();
    }

    const transport = nodemailer.createTransport({
      host: account?.smtp?.host || this.appConfiguration.smt.host,
      port: account?.smtp?.port || Number(this.appConfiguration.smt.port),
      secure: account?.smtp?.secure || false,
      auth: {
        user: account?.user || this.appConfiguration.smt.user,
        pass: account?.pass || this.appConfiguration.smt.password
      }
    });

    return transport;
  }

  public async sendEmail(
    useTestAccount: boolean,
    fromEmail: string,
    emails: string[],
    htmlString: string,
    subject: string,
    text: string,
    attachments: Attachment[]
  ): Promise<void> {
    const subjectTo = this.appConfiguration.environment === 'production' ? subject : `${this.appConfiguration.environment} | ${subject}`;

    const transport = await this.createTransport(useTestAccount);

    const info = await transport.sendMail({
      from: fromEmail,
      to: emails.toString(),
      subject: subjectTo,
      text,
      html: htmlString,
      attachments
    });

    Logger.debug(`'Message sent: ${info.messageId}`, 'MailerService');
  }
}
