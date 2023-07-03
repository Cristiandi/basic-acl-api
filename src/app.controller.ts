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
    return this.health.check([
      () => this.http.pingCheck('API', `https://api.basic-acl.com/`),
    ]);
  }
}
