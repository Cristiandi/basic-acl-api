import { CanActivate, ExecutionContext, Injectable, Inject, HttpException, HttpStatus, Logger } from '@nestjs/common';
// import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';

import appConfig from '../../config/app.config';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

import { FirebaseAdminService } from '../plugins/firebase-admin/firebase-admin.service';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly usersService: UsersService
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

    const authorization: string = request.headers['Authorization'] || request.headers['authorization'];
    if (!authorization) {
      throw new HttpException('authorization header not found', HttpStatus.UNAUTHORIZED);
    }

    const authArray = authorization.split(' ');

    const token = authArray.length ? authArray[1] : null;

    if (!token) {
      Logger.error('can not get the token from authorization header.', undefined, 'AuthorizationGuard');
      return false;
    }

    try {
      const user = await this.usersService.getUserByToken({ companyUuid, token });

      if (!user.isAdmin) {
        Logger.error('the user is not an admin.', undefined, 'AuthorizationGuard');
        return false;
      }

      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }
}
