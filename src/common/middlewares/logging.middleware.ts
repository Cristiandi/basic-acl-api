import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): void {
    
    // eslint-disable-next-line no-console
    console.time('request-response time');

    // Logger.log(`requested route: ${req.originalUrl} | method: ${req.method}`, LoggingMiddleware.name);

    res.on('finish', () => {
      Logger.log(`requested route: ${req.originalUrl} | method: ${req.method} | status: ${res.statusCode}`, LoggingMiddleware.name);
      // eslint-disable-next-line no-console
      console.timeEnd('request-response time');
    });

    next();
  }
}
