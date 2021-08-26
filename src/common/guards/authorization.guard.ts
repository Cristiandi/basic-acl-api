import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
// import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';

import appConfig from '../../config/app.config';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

import { CompanyService } from '../../modules/company/services/company.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    private readonly companyService: CompanyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) return true;

    const ctx = GqlExecutionContext.create(context);
    const { req: request } = ctx.getContext();

    const accessKey: string = request.headers['access-key'];
    if (!accessKey) {
      throw new UnauthorizedException('access-key header not found');
    }

    try {
      const company = await this.companyService.getOneByOneFields({
        fields: { accessKey },
        checkIfExists: false,
      });

      if (!company) {
        Logger.error(
          `can't get the company for the access key ${accessKey}`,
          AuthorizationGuard.name,
        );
        return false;
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
