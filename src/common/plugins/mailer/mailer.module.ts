import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';


import { ParametersModule } from 'src/modules/parameters/parameters.module';
import { MailerService } from './mailer.service';

import appConfig from '../../../config/app.config';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    ParametersModule
  ],
  providers: [MailerService],
  exports: [MailerService]
})
export class MailerModule {}
