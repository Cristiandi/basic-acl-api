import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

import { AppService } from './app.service';

import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  getHealth(): Promise<HealthCheckResult> {
    let urlToCheck;
    switch (process.env.NODE_ENV) {
      case 'local':
        urlToCheck = 'http://localhost:8080/';
        break;
      case 'development':
        urlToCheck = 'https://dev.api.basic-acl.com/';
      case 'production':
        urlToCheck = 'https://api.basic-acl.com/';
      default:
        throw new Error(
          `NODE_ENV does not contain a valid value for health check ${process.env.NODE_ENV}`,
        );
        break;
    }

    return this.health.check([() => this.http.pingCheck('API', urlToCheck)]);
  }
}
