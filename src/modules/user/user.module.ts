import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from '../role/role.module';

import appConfig from '../../config/app.config';

import { User } from './user.entity';

import { UserService } from './services/user.service';
import { UserExtraService } from './services/user-extra.service';
import { UserLoaders } from './user.loaders';
import { UserResolver } from './resolvers/user.resolver';
import { UserExtraResolver } from './resolvers/user-extra.resolver';

import { CompanyModule } from '../company/company.module';
import { FirebaseAdminModule } from '../../plugins/firebase-admin/firebase-admin.module';
import { EmailTemplateModule } from '../email-template/email-template.module';
import { MailgunModule } from '../../plugins/mailgun/mailgun.module';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { UserController } from './user.controller';
import { AssignedRoleModule } from '../assigned-role/assigned-role.module';
import { FirebaseModule } from '../../plugins/firebase/firebase.module';
@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forFeature([User]),
    CompanyModule,
    FirebaseAdminModule,
    EmailTemplateModule,
    MailgunModule,
    VerificationCodeModule,
    RoleModule,
    AssignedRoleModule,
    FirebaseModule,
  ],
  providers: [
    UserService,
    UserExtraService,
    UserLoaders,
    UserResolver,
    UserExtraResolver,
  ],
  exports: [UserService, UserExtraService],
  controllers: [UserController],
})
export class UserModule {}
