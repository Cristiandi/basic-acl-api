import * as mjml2html from 'mjml';
import hbs from 'handlebars';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '../../common/base.service';

import { EmailTemplate } from './email-template.entity';

import { CompanyService } from '../company/services/company.service';

import { GetEmailTemplateStringInput } from './dto/get-email-template-string-input.dto';
import { GenerateTemplateHtml } from './dto/generate-template-html-input.dto';

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
  ): Promise<string> {
    const { type, companyUid } = input;

    let company;
    if (companyUid) {
      company = await this.companyService.getOne({
        uid: companyUid,
      });
    }

    const existing = await this.getOneByOneFields({
      fields: {
        type,
        company: company || null,
      },
      checkIfExists: true,
    });

    return existing.file.toString('utf-8');
  }

  public async generateTemplateHtml(
    input: GenerateTemplateHtml,
  ): Promise<string> {
    const { type, companyUid } = input;

    // the the email template string
    const emailTemplateString = await this.getEmailTemplateString({
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

    return html;
  }
}
