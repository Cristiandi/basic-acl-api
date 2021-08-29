import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from '../../app.module';
import { EmailTemplateService } from '../../modules/email-template/email-template.service';
import { TemplateType } from '../../modules/email-template/email-template.entity';

(async () => {
  // getting the nest js app
  const application = await NestFactory.createApplicationContext(AppModule);

  const emailTemplateService = application.get(EmailTemplateService);

  Logger.log('INIT');

  const result = await emailTemplateService.generateTemplateHtml({
    type: TemplateType.CONFIRMATION_EMAIL,
    parameters: {
      firstName: 'John',
      link: 'http://www.google.com',
    },
  });

  Logger.log(result.subject);
  Logger.log(result.html);

  Logger.log('END');
})()
  .catch((err) => console.error(err))
  .finally(() => process.exit(0));
