import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): void {
    Logger.log(`requested route: ${req.originalUrl} | method: ${req.method}`, LoggerMiddleware.name);
    next();
  }
}
