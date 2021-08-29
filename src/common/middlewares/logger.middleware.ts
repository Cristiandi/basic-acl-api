import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

const fieldNamesToHide = ['firebaseAdminConfig', 'firebaseConfig', 'accessKey'];

export const loggerMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const { fieldName } = ctx.info;

  if (fieldNamesToHide.includes(fieldName)) {
    return null;
  }

  const value = await next();

  // console.log('value', value);

  return value;
};
