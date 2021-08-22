import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from '../../app.module';
import { UserExtraService } from '../../modules/user/services/user-extra.service';

(async () => {
  // getting the nest js app
  const application = await NestFactory.createApplicationContext(AppModule);

  const userExtraService = application.get(UserExtraService);

  Logger.log('INIT');

  await userExtraService.sendConfirmationEmail({
    authUid: 'HkAdMswP6NRcD62DUXLk1jelDLI3',
  });

  Logger.log('END');
})()
  .catch((err) => console.error(err))
  .finally(() => process.exit(0));
