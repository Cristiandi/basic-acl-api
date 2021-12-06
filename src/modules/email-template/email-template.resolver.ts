import { UsePipes, ValidationPipe } from '@nestjs/common';
import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

import { EmailTemplate } from './email-template.entity';
import { Company } from '../company/company.entity';

import { EmailTemplateService } from './email-template.service';

import { EmailTemplateLoaders } from './email-template.loaders';

import { CreateEmailTemplateInput } from './dto/create-email-template-input.dto';
import { GetOneEmailTemplateInput } from './dto/get-one-email-template-input.dto';
import { UpdateEmailTemplateInput } from './dto/update-email-template-input.dto';
import { GetAllEmailTemplatesInput } from './dto/get-all-email-templates-input,dto';
import { PreviewEmailTemplateInput } from './dto/preview-email-template-input.dto';
import { PreviewEmailTemplateOutput } from './dto/preview-email-template-output.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => EmailTemplate)
export class EmailTemplateResolver {
  constructor(
    private readonly service: EmailTemplateService,
    private readonly loaders: EmailTemplateLoaders,
  ) {}

  @Mutation(() => EmailTemplate, { name: 'createEmailTemplate' })
  public create(
    @Args('createEmailTemplateInput')
    createEmailTemplateInput: CreateEmailTemplateInput,
  ): Promise<EmailTemplate> {
    return this.service.create(createEmailTemplateInput);
  }

  @Query(() => [EmailTemplate], { name: 'getAllEmailTemplates' })
  public getAll(
    @Args('getAllEmailTemplatesInput')
    getAllEmailTemplatesInput: GetAllEmailTemplatesInput,
  ): Promise<EmailTemplate[]> {
    return this.service.getAll(getAllEmailTemplatesInput);
  }

  @Mutation(() => EmailTemplate, { name: 'updateEmailTemplate' })
  public update(
    @Args('getOneEmailTemplateInput')
    getOneEmailTemplateInput: GetOneEmailTemplateInput,
    @Args('updateCompanyInput')
    updateEmailTemplateInput: UpdateEmailTemplateInput,
  ): Promise<EmailTemplate> {
    return this.service.update(
      getOneEmailTemplateInput,
      updateEmailTemplateInput,
    );
  }

  @Mutation(() => EmailTemplate, { name: 'deleteEmailTemplate' })
  public delete(
    @Args('getOneEmailTemplateInput')
    getOneEmailTemplateInput: GetOneEmailTemplateInput,
  ): Promise<EmailTemplate> {
    return this.service.delete(getOneEmailTemplateInput);
  }

  @Mutation(() => EmailTemplate, { name: 'uploadEmailTemplate' })
  upload(
    @Args('getOneEmailTemplateInput')
    getOneEmailTemplateInput: GetOneEmailTemplateInput,
    @Args({ name: 'file', type: () => GraphQLUpload }) fileUpload: FileUpload,
  ): Promise<EmailTemplate> {
    return this.service.upload(getOneEmailTemplateInput, fileUpload);
  }

  @Mutation(() => PreviewEmailTemplateOutput, { name: 'previewEmailTemplate' })
  preview(
    @Args('getOneEmailTemplateInput')
    getOneEmailTemplateInput: GetOneEmailTemplateInput,
    @Args('previewEmailTemplateInput') input: PreviewEmailTemplateInput,
  ): Promise<PreviewEmailTemplateOutput> {
    return this.service.preview(getOneEmailTemplateInput, input);
  }

  @ResolveField(() => Company, { name: 'company' })
  company(@Parent() parent: EmailTemplate): Promise<Company> {
    const value: any = parent.company;

    let id = value;

    if (typeof id !== 'number') id = value.id;

    return this.loaders.batchCompanies.load(id);
  }
}
