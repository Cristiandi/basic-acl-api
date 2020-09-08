import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  environment: process.env.NODE_ENV || 'local',
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 8080,
    apiKey: process.env.API_KEY,
    maxHitsAllowed: parseInt(process.env.MAX_HITS_ALLOWED) || 1,
    maxHitsTimeRange: parseInt(process.env.MAX_HITS_TIME_RANGE) || 60
  },
  database: {
    client: process.env.DATABASE_CLIENT,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    clientName: process.env.REDIS_CLIENT_NAME
  }
}));