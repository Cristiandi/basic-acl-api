import * as mjml2html from 'mjml';
import hbs from 'handlebars';

import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload } from 'graphql-upload';

import { BaseService } from '../../common/base.service';

import { EmailTemplate } from './email-template.entity';

import { CompanyService } from '../company/services/company.service';

import { streamToString } from '../../utils';

import { GetEmailTemplateStringInput } from './dto/get-email-template-string-input.dto';
import { GenerateTemplateHtmlInput } from './dto/generate-template-html-input.dto';
import { GetEmailTemplateStringOutput } from './dto/get-email-template-string-output.dto';
import { GenerateTemplateHtmlOutput } from './dto/generate-template-html-output.dto';
import { CreateEmailTemplateInput } from './dto/create-email-template-input.dto';
import { GetOneEmailTemplateInput } from './dto/get-one-email-template-input.dto';
import { UpdateEmailTemplateInput } from './dto/update-email-template-input.dto';
import { GetAllEmailTemplatesInput } from './dto/get-all-email-templates-input,dto';
import { PreviewEmailTemplateOutput } from './dto/preview-email-template-output.dto';
import { PreviewEmailTemplateInput } from './dto/preview-email-template-input.dto';

@Injectable()
export class EmailTemplateService extends BaseService<EmailTemplate> {
  constructor(
    @InjectRepository(EmailTemplate)
    private readonly emailTemplateRepository: Repository<EmailTemplate>,
    private readonly companyService: CompanyService,
  ) {
    super(emailTemplateRepository);
  }

  public async create(input: CreateEmailTemplateInput): Promise<EmailTemplate> {
    const { companyUid, type, subject } = input;

    // get the company
    const company = await this.companyService.getOne({
      uid: companyUid,
    });

    if (!company) {
      throw new NotFoundException('company not found');
    }

    const existingEmailTemplate = await this.getOneByOneFields({
      fields: {
        type,
        company,
      },
    });

    if (existingEmailTemplate) {
      throw new ConflictException('email template already exists');
    }

    const created = this.emailTemplateRepository.create({
      type,
      subject,
      company,
    });

    const saved = await this.emailTemplateRepository.save(created);

    return saved;
  }

  public async getAll(
    input: GetAllEmailTemplatesInput,
  ): Promise<EmailTemplate[]> {
    const { companyUid, limit, skip, q } = input;

    const query = this.emailTemplateRepository
      .createQueryBuilder('emailTemplate')
      .loadAllRelationIds()
      .innerJoin('emailTemplate.company', 'company')
      .where('company.uid = :companyUid', { companyUid });

    if (q)
      query.andWhere('emailTemplate.subject ilike :q', {
        q: `%${q}%`,
      });

    query.limit(limit || 10).skip(skip);

    const items = await query.getMany();

    return items;
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

  public async update(
    getOneEmailTemplate: GetOneEmailTemplateInput,
    input: UpdateEmailTemplateInput,
  ): Promise<EmailTemplate> {
    const { uid } = getOneEmailTemplate;

    // get the email template
    const existing = await this.getOneByOneFields({
      fields: {
        uid,
      },
      relations: ['company'],
      checkIfExists: true,
    });

    const { type } = input;

    const compareTo = await this.getOneByOneFields({
      fields: {
        type: type || existing.type,
        company: existing.company,
      },
    });

    if (compareTo && compareTo.id !== existing.id) {
      throw new ConflictException('email template already exists');
    }

    const preloaded = await this.emailTemplateRepository.preload({
      id: existing.id,
      ...input,
    });

    const updated = await this.emailTemplateRepository.save(preloaded);

    return updated;
  }

  public async delete(
    getOneEmailTemplate: GetOneEmailTemplateInput,
  ): Promise<EmailTemplate> {
    const { uid } = getOneEmailTemplate;

    // get the email template
    const existing = await this.getOneByOneFields({
      fields: {
        uid,
      },
      checkIfExists: true,
    });

    const clone = { ...existing };

    await this.emailTemplateRepository.remove(existing);

    return clone as EmailTemplate;
  }

  public async upload(
    getOneEmailTemplate: GetOneEmailTemplateInput,
    fileUpload: FileUpload,
  ): Promise<EmailTemplate> {
    const { uid } = getOneEmailTemplate;

    // get the email template
    const existing = await this.getOneByOneFields({
      fields: {
        uid,
      },
      checkIfExists: true,
    });

    try {
      const { filename, mimetype } = fileUpload;

      if (mimetype !== 'application/octet-stream') {
        throw new BadRequestException('invalid mimetype');
      }

      const fileExt = filename.split('.').pop();

      if (fileExt !== 'mjml') {
        throw new BadRequestException('invalid file type');
      }

      const { createReadStream } = fileUpload;

      const stream = createReadStream();

      const fileString: string = await streamToString(stream);

      const preloaded = await this.emailTemplateRepository.preload({
        id: existing.id,
        file: Buffer.from(fileString),
      });

      const updated = await this.emailTemplateRepository.save(preloaded);

      return updated;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  public async preview(
    getOneEmailTemplate: GetOneEmailTemplateInput,
    input: PreviewEmailTemplateInput,
  ): Promise<PreviewEmailTemplateOutput> {
    const { uid } = getOneEmailTemplate;

    // get the email template
    const existing = await this.getOneByOneFields({
      fields: {
        uid,
      },
      relations: ['company'],
      checkIfExists: true,
    });

    if (!existing.file) {
      throw new ConflictException('no file in the template');
    }

    const { parameters } = input;

    const { html } = await this.generateTemplateHtml({
      companyUid: existing.company.uid,
      type: existing.type,
      parameters,
    });

    return {
      html,
    };
  }
}
