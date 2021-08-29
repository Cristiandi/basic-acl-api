// eslint-disable-next-line @typescript-eslint/no-var-requires
const Mailgun = require('mailgun.js');
import * as formData from 'form-data';

import { Inject, Injectable, Logger } from '@nestjs/common';

import { ConfigType } from '@nestjs/config';

import appConfig from '../../config/app.config';
import { SendEmailInput } from './dto/send-email-input.dto';

@Injectable()
export class MailgunService {
  private mg;

  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) {
    const mailgun = new Mailgun(formData);
    this.mg = mailgun.client({
      username: 'api',
      key: this.appConfiguration.mailgun.privateKey,
      public_key: this.appConfiguration.mailgun.publicKey,
    });
  }

  public async sendEmail(input: SendEmailInput): Promise<void> {
    const { subject } = input;
    const subjectToUse =
      this.appConfiguration.environment === 'production'
        ? subject
        : `${this.appConfiguration.environment} | ${subject}`;

    // console.log('sendEmailInput', sendEmailInput);
    // console.log('subjectTo', subjectTo);

    const msg = await this.mg.messages.create(
      this.appConfiguration.mailgun.domain,
      {
        from: input.from,
        to: input.to,
        subject: subjectToUse,
        text: input.text,
        html: input.html,
        attachment: input.attachment,
      },
    );

    Logger.log(`${JSON.stringify(msg)}`);
  }
}
