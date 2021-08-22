import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';

import { UserService } from './services/user.service';
import { UserExtraService } from './services/user-extra.service';
import { UserLoaders } from './user.loaders';
import { UserResolver } from './resolvers/user.resolver';
import { UserExtraResolver } from './resolvers/user-extra.resolver';

import { CompanyModule } from '../company/company.module';
import { FirebaseAdminModule } from '../../plugins/firebase-admin/firebase-admin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CompanyModule,
    FirebaseAdminModule,
  ],
  providers: [
    UserService,
    UserExtraService,
    UserLoaders,
    UserResolver,
    UserExtraResolver,
  ],
  exports: [UserService, UserExtraService],
})
export class UserModule {}
