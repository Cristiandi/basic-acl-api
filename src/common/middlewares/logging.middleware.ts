import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): void {
    
    // eslint-disable-next-line no-console
    console.time('request-response time');

    Logger.log(`requested route: ${req.originalUrl} | method: ${req.method}`, LoggingMiddleware.name);

    // eslint-disable-next-line no-console
    res.on('finish', () => console.timeEnd('request-response time'));

    next();
  }
}
