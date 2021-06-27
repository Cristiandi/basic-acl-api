import * as Joi from 'joi';

export default Joi.object({
  /* APP */
  PORT: Joi.required(),

  /* DATABASE INFORMATION */
  DATABASE_CLIENT: Joi.required(),
  DATABASE_HOST: Joi.required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USER: Joi.required(),
  DATABASE_PASSWORD: Joi.required(),
  DATABASE_NAME: Joi.required(),
});
