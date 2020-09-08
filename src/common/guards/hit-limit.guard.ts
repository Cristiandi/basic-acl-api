import * as requestIp from 'request-ip';
import * as md5 from 'md5';
import { CanActivate, ExecutionContext, Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';
// import { Observable } from 'rxjs';
import { RedisService } from 'nestjs-redis';

import appConfig from '../../config/app.config';

import { HITS_WATCHER } from '../decorators/hits-watcher.decorator';

@Injectable()
export class HitLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    private readonly redisService: RedisService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // get the meta data for the handler
    const handlerMetaData = this.reflector.get(HITS_WATCHER, context.getHandler());

    // get the request
    const request = context.switchToHttp().getRequest();

    // get the genral config options
    const {
      app: { maxHitsAllowed, maxHitsTimeRange },
      redis: { clientName }
    } = this.appConfiguration;

    // determinate the allowed hits and the time range for that hits
    const hitsAllowed = handlerMetaData ? handlerMetaData.hitsAllowed : maxHitsAllowed;
    const timeRange = handlerMetaData ? handlerMetaData.timeRange : maxHitsTimeRange;

    // get the redis client
    const redisClient = await this.redisService.getClient(clientName);

    // get the requested url
    const { raw: { originalUrl } } = request;

    // get client ip
    const clientIp = requestIp.getClientIp(request);

    // define the key
    const key = md5(`${clientIp}|${originalUrl}`);

    // define the value for the key
    const initialTimeDate = new Date();

    // define the key value
    const keyValue = {
      hits: 1,
      initalTime: initialTimeDate.getTime()
    };

    // try to get the key value
    const unParsedKeyValue = await redisClient.get(key);

    // if i do not have value for that key
    if (!unParsedKeyValue) {
      await redisClient.set(key, JSON.stringify(keyValue), 'EX', timeRange);
    } else {
      // try to parse
      const parsedKeyValue = JSON.parse(unParsedKeyValue);

      // get the attributes from the key value 
      const { hits, initalTime } = parsedKeyValue;

      // otherwise check the number of hits
      if (hits >= hitsAllowed) {
        throw new HttpException('max hits exceeded.', HttpStatus.TOO_MANY_REQUESTS);
      }

      // set the new value for the key
      const newKeyValue = {
        hits: hits + 1,
        initalTime
      };

      await redisClient.set(key, JSON.stringify(newKeyValue), 'EX', timeRange);
    }

    return true;
  }
}
