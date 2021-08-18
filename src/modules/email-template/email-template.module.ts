import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailTemplate } from './email-template.entity';

import { EmailTemplateService } from './email-template.service';
import { EmailTemplateResolver } from './email-template.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([EmailTemplate])],
  providers: [EmailTemplateService, EmailTemplateResolver],
  exports: [EmailTemplateService],
})
export class EmailTemplateModule {}
