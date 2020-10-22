import { CanActivate, ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import appConfig from 'src/config/app.config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) return true;
    
    const request = context.switchToHttp().getRequest();
    
    const authHeader = request.headers['Authorization'] || request.headers['authorization'];

    return authHeader === this.appConfiguration.app.apiKey;
  }
}
