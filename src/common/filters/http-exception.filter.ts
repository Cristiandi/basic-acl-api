import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';


@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const error = typeof exceptionResponse === 'string' ? { message: exceptionResponse }
    // eslint-disable-next-line @typescript-eslint/ban-types
    : (exceptionResponse as object);
  
    response.status(status);
    response.send({
      ...error,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }
}