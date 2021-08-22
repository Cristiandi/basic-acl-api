import * as Joi from 'joi';

export default Joi.object({
  /* APP */
  PORT: Joi.required(),

  /* DATABASE */
  DATABASE_CLIENT: Joi.required(),
  DATABASE_HOST: Joi.required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.required(),
  DATABASE_PASSWORD: Joi.required(),
  DATABASE_NAME: Joi.required(),

  /* MAILGUN */
  MAILGUN_DOMAIN: Joi.required(),
  MAILGUN_PRIVATE_KEY: Joi.required(),
  MAILGUN_PUBLIC_KEY: Joi.required(),
});
