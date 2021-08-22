import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';

import { UserService } from './user.service';
import { UserLoaders } from './user.loaders';
import { UserResolver } from './user.resolver';

import { CompanyModule } from '../company/company.module';
import { FirebaseAdminModule } from '../../plugins/firebase-admin/firebase-admin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CompanyModule,
    FirebaseAdminModule,
  ],
  providers: [UserService, UserLoaders, UserResolver],
  exports: [UserService],
})
export class UserModule {}
