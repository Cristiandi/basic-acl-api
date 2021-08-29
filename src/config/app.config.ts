import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    environment: process.env.NODE_ENV || 'development',
    app: {
      port: parseInt(process.env.PORT, 10) || 8080,
      apiKey: process.env.API_KEY,
      selfApiUrl: process.env.SELF_API_URL,
      selftWebUrl: process.env.SELF_WEB_URL,
    },
    database: {
      client: process.env.DATABASE_CLIENT,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      log: process.env.DATABASE_LOG || 'yes',
    },
    smt: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PW,
    },
    mailgun: {
      domain: process.env.MAILGUN_DOMAIN,
      privateKey: process.env.MAILGUN_PRIVATE_KEY,
      publicKey: process.env.MAILGUN_PUBLIC_KEY,
      emailFrom: process.env.MAILGUN_EMAIL_FROM,
    },
  };
});
