import { Module } from '@nestjs/common';
import { HttpRoutesService } from './http-routes.service';
import { HttpRoutesController } from './http-routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpRoute } from './http-route.entity';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HttpRoute]),
    CompaniesModule
  ],
  providers: [HttpRoutesService],
  controllers: [HttpRoutesController],
  exports: [HttpRoutesService]
})
export class HttpRoutesModule {}
