import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesModule } from '../companies/companies.module';
import { FirebaseModule } from 'src/common/plugins/firebase/firebase.module';

import { User } from './user.entitty';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FirebaseAdminModule } from 'src/common/plugins/firebase-admin/firebase-admin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CompaniesModule,
    FirebaseModule,
    FirebaseAdminModule
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
