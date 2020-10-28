import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-redis';
import { ConfigModule } from '@nestjs/config';

import appConfig from '../../config/app.config';

import { User } from './user.entity';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { CompaniesModule } from '../companies/companies.module';
import { FirebaseModule } from '../../common/plugins/firebase/firebase.module';
import { FirebaseAdminModule } from '../../common/plugins/firebase-admin/firebase-admin.module';
import { ParametersModule } from '../parameters/parameters.module';
import { TemplatesModule } from 'src/common/templates/templates.module';
import { MailerModule } from 'src/common/plugins/mailer/mailer.module';
import { ConfirmationEmailConfigsModule } from '../confirmation-email-configs/confirmation-email-configs.module';
import { VerificationCodesModule } from '../verification-codes/verification-codes.module';
import { ForgottenPasswordConfigsModule } from '../forgotten-password-configs/forgotten-password-configs.module';
import { RolesModule } from '../roles/roles.module';
import { AssignedRolesModule } from '../assigned-roles/assigned-roles.module';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forFeature([User]),
    CompaniesModule,
    FirebaseModule,
    FirebaseAdminModule,
    ParametersModule,
    TemplatesModule,
    MailerModule,
    ConfirmationEmailConfigsModule,
    VerificationCodesModule,
    ForgottenPasswordConfigsModule,
    RolesModule,
    forwardRef(() => AssignedRolesModule),
    RedisModule.forRootAsync({
      useFactory: () => ({
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        name: process.env.REDIS_CLIENT_NAME
      })
    })    
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
