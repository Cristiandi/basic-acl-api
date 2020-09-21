import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsService } from '../projects/projects.service';
import { HttpRoute } from './http-route.entity';

@Injectable()
export class HttpRoutesService {
  constructor(
    @InjectRepository(HttpRoute)
    private readonly httpRouteRepository: Repository<HttpRoute>,
    private readonly projectsService: ProjectsService
  ) {}
}
