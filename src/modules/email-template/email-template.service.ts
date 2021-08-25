import * as mjml2html from 'mjml';
import hbs from 'handlebars';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../common/base.service';

import { EmailTemplate } from './email-template.entity';

import { CompanyService } from '../company/services/company.service';

import { GetEmailTemplateStringInput } from './dto/get-email-template-string-input.dto';
import { GenerateTemplateHtmlInput } from './dto/generate-template-html-input.dto';
import { GetEmailTemplateStringOutput } from './dto/get-email-template-string-output.dto';
import { GenerateTemplateHtmlOutput } from './dto/generate-template-html-output.dto';

@Injectable()
export class EmailTemplateService extends BaseService<EmailTemplate> {
  constructor(
    @InjectRepository(EmailTemplate)
    private readonly emailTemplateRepository: Repository<EmailTemplate>,
    private readonly companyService: CompanyService,
  ) {
    super(emailTemplateRepository);
  }

  public async getEmailTemplateString(
    input: GetEmailTemplateStringInput,
  ): Promise<GetEmailTemplateStringOutput> {
    const { type, companyUid } = input;

    // try to get the company
    let company;
    if (companyUid) {
      company = await this.companyService.getOne({
        uid: companyUid,
      });
    }

    // get the email template
    let existing;
    if (company) {
      existing = await this.getOneByOneFields({
        fields: {
          type,
          company: company,
        },
        checkIfExists: false,
      });
    }

    if (!existing) {
      existing = await this.getOneByOneFields({
        fields: {
          type,
        },
        checkIfExists: true,
      });
    }

    // return the email template string
    return {
      stringValue: existing.file.toString('utf-8'),
      subject: existing.subject,
    };
  }

  public async generateTemplateHtml(
    input: GenerateTemplateHtmlInput,
  ): Promise<GenerateTemplateHtmlOutput> {
    const { type, companyUid } = input;

    // the the email template string
    const { stringValue: emailTemplateString, subject } =
      await this.getEmailTemplateString({
        type,
        companyUid,
      });

    // compile the template
    const template = hbs.compile(emailTemplateString);

    const { parameters } = input;

    // get the result
    const result = template(parameters);

    // get the html
    const { html } = mjml2html(result);

    return {
      html,
      subject,
    };
  }
}
