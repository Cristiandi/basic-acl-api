import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailTemplate } from './email-template.entity';

import { EmailTemplateService } from './email-template.service';
import { EmailTemplateLoaders } from './email-template.loaders';
import { EmailTemplateResolver } from './email-template.resolver';

import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplate]), CompanyModule],
  providers: [
    EmailTemplateService,
    EmailTemplateLoaders,
    EmailTemplateResolver,
  ],
  exports: [EmailTemplateService],
})
export class EmailTemplateModule {}
