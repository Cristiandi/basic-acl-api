import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesModule } from '../companies/companies.module';
import { FirebaseModule } from '../../common/plugins/firebase/firebase.module';

import { User } from './user.entitty';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FirebaseAdminModule } from '../../common/plugins/firebase-admin/firebase-admin.module';
import { ParametersModule } from '../parameters/parameters.module';
import { TemplatesModule } from 'src/common/templates/templates.module';
import { MailerModule } from 'src/common/plugins/mailer/mailer.module';
import { ConfirmationEmailConfigsModule } from '../confirmation-email-configs/confirmation-email-configs.module';
import { VerificationCodesModule } from '../verification-codes/verification-codes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CompaniesModule,
    FirebaseModule,
    FirebaseAdminModule,
    ParametersModule,
    TemplatesModule,
    MailerModule,
    ConfirmationEmailConfigsModule,
    VerificationCodesModule
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
