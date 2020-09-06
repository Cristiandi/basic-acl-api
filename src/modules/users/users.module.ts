import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesModule } from '../companies/companies.module';
import { FirebaseModule } from 'src/common/plugins/firebase/firebase.module';

import { User } from './user.entitty';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CompaniesModule,
    FirebaseModule
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
