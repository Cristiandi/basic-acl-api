import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const loggerMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  console.dir(ctx.info);

  const value = await next();
  // console.log('operation name:', operationName, 'value', value);
  return value;
};
