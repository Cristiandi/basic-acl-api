import 'ts-node/register'
import environment from './src/environment'

const config = {
  client: environment.DB_CLIENT,
  connection: {
    host: environment.DB_HOST,
    user: environment.DB_USER,
    password: environment.DB_PASSWORD,
    database: environment.DB_NAME,
    port: environment.DB_PORT
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations'
  }
}

module.exports = { ...config }
