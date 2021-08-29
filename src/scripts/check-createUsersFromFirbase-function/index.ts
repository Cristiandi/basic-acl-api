import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from '../../app.module';
import { UserExtraService } from '../../modules/user/services/user-extra.service';

(async () => {
  // getting the nest js app
  const application = await NestFactory.createApplicationContext(AppModule);

  const userExtraService = application.get(UserExtraService);

  Logger.log('INIT');

  await userExtraService.createUsersFromFirebase({
    companyUid: 'af6fd554-8cb2-4dad-97b5-957380caeb6f',
    roleCode: '01ROL',
  });

  Logger.log('END');
})().catch((err) => console.error(err));
