import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

let envPath

// validate the NODE_ENV
const NODE_ENV = process.env.NODE_ENV
switch (NODE_ENV) {
  case 'development':
    envPath = path.resolve(__dirname, '../.env.development')
    break
  case 'staging':
    envPath = path.resolve(__dirname, '../.env.staging')
    break
  case 'production':
    envPath = path.resolve(__dirname, '../.env.production')
    break
  default:
    envPath = path.resolve(__dirname, '../.env.local')
    break
}

dotenv.config({ path: envPath })

const environment = {
  /* GENERAL */
  NODE_ENV,
  APP_PORT: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  /* DATABASE INFORMATION */
  DB_CLIENT: process.env.DB_CLIENT || '',
  DB_HOST: process.env.DB_HOST || '',
  DB_USER: process.env.DB_USER || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || '',
  DB_PORT: process.env.DB_PORT || ''
}

export default environment
