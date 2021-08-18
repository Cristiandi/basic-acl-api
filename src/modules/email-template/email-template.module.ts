import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailTemplate } from './email-template.entity';

import { EmailTemplateService } from './email-template.service';
import { EmailTemplateResolver } from './email-template.resolver';

import { CompanyModule } from '../company/company.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplate]), CompanyModule],
  providers: [EmailTemplateService, EmailTemplateResolver],
  exports: [EmailTemplateService],
})
export class EmailTemplateModule {}
