import { Module } from '@nestjs/common';
import { HttpRoutesService } from './http-routes.service';
import { HttpRoutesController } from './http-routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpRoute } from './http-route.entity';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HttpRoute]),
    ProjectsModule
  ],
  providers: [HttpRoutesService],
  controllers: [HttpRoutesController],
  exports: [HttpRoutesService]
})
export class HttpRoutesModule {}
