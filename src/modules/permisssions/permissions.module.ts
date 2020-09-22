import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission } from './permission.entity';

import { PermissionsService } from './permissions.service';

import { PermisssionsController } from './permissions.controller';

import { RolesModule } from '../roles/roles.module';
import { HttpRoutesModule } from '../http-routes/http-routes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    RolesModule,
    HttpRoutesModule
  ],
  providers: [PermissionsService],
  controllers: [PermisssionsController],
  exports: [PermissionsService]
})
export class PermissionsModule {}
