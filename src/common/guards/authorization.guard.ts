import { CanActivate, ExecutionContext, Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
// import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';

import appConfig from '../../config/app.config';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

import { FirebaseAdminService } from '../plugins/firebase-admin/firebase-admin.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    private readonly firebaseAdminService: FirebaseAdminService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) return true;
    
    const request = context.switchToHttp().getRequest();
    
    const companyUuid = request.headers['company-uuid'];
    if (!companyUuid) {
      throw new HttpException('company-uuid header not found', HttpStatus.UNAUTHORIZED);
    }

    const authorization = request.headers['Authorization'] || request.headers['authorization'];
    if (!authorization) {
      throw new HttpException('authorization header not found', HttpStatus.UNAUTHORIZED);
    }

    const apiKey = authorization.startsWith('NOT_IMPLEMENTED') ? authorization : null;
    const token = !apiKey ? authorization.split(' ')[1] : null;

    try {
      await this.firebaseAdminService.verifyToken({ companyUuid, token });

      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }
}
