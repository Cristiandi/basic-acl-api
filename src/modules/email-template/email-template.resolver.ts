import { Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { EmailTemplate } from './email-template.entity';

import { EmailTemplateService } from './email-template.service';

import { CreateEmailTemplateInput } from './dto/create-email-template-input.dto';
import { GetOneEmailTemplateInput } from './dto/get-one-email-template-input.dto';
import { UpdateEmailTemplateInput } from './dto/update-email-template-input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver()
export class EmailTemplateResolver {
  constructor(private readonly service: EmailTemplateService) {}

  @Mutation(() => EmailTemplate, { name: 'createEmailTemplate' })
  public create(
    @Args('createEmailTemplateInput')
    createEmailTemplateInput: CreateEmailTemplateInput,
  ): Promise<EmailTemplate> {
    return this.service.create(createEmailTemplateInput);
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
}
