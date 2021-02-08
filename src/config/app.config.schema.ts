import * as Joi from 'joi';

export default Joi.object({
  /* DATABASE INFORMATION */
  DATABASE_CLIENT: Joi.required(),
  DATABASE_HOST: Joi.required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.required(),
  DATABASE_PASSWORD: Joi.required(),
  DATABASE_NAME: Joi.required(),
  /* API INFORMATION */
  API_KEY: Joi.required(),
  SELF_API_URL: Joi.required(),
  MAX_HITS_ALLOWED: Joi.number().default(1),
  MAX_HITS_TIME_RANGE: Joi.number().default(60),
  /* REDIS INFORMATION */
  REDIS_HOST: Joi.required(),
  REDIS_PORT: Joi.required(),
  REDIS_PASSWORD: Joi.required(),
  REDIS_CLIENT_NAME: Joi.required(),
  /* SMT */
  SMTP_HOST: Joi.required(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.required(),
  SMTP_PW: Joi.required(),
  /* WEB */
  SELF_WEB_URL: Joi.required()
});
