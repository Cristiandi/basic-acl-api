import Knex from 'knex'
// import { FastifyPlugin } from 'fastify'
// import fp from 'fastify-plugin'
import { singleton } from 'tsyringe'
import environment from './environment'
import { throwError, isEmptyObject } from './utils'

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
    max: 50
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}

const knex = Knex(config)

@singleton()
export class Database {
  public knex: Knex;
  constructor () {
    this.knex = knex
  }

  public async createOne (tableName: string, objectToCreate = {}, trx?: any): Promise<any | null> {
    const db = trx || this.knex

    const query = db(tableName)
      .returning('id')
      .insert(objectToCreate)

    // console.log('sql', query.toString())

    const [id] = await query

    const created = await this.getOne(tableName, { id }, trx)

    return created
  }

  public async getOne (tableName: string, attributes = {}, trx?: any): Promise<any | null> {
    const db = trx || this.knex

    const query = db
      .select('*')
      .from(tableName)
      .where(attributes)
      .orderBy('id', 'desc')
      .limit(1)

    const data = await query

    if (!data.length) return null

    return data[0]
  }

  public async getAll (tableName: string, attributes = {}, trx?: any): Promise<any [] | null> {
    const db = trx || this.knex

    const query = db
      .select('*')
      .from(tableName)
      .where(attributes)
      .orderBy('id', 'desc')

    const data = await query

    if (!data.length) return null

    return data
  }

  public async updateOne (tableName: string, id: number, objectToUpdate = {}, trx?: any): Promise<any | null> {
    const db = trx || this.knex

    const existing = await this.getOne(tableName, { id }, trx)

    if (!existing) {
      throw throwError(404, `can't get the ${tableName} with id ${id}.`)
    }

    if (isEmptyObject(objectToUpdate)) return existing

    await db(tableName)
      .update(objectToUpdate)
      .where({ id })

    const updated = await this.getOne(tableName, { id }, trx)

    return updated
  }

  public async deleteOne (id: number, tableName: string, trx?: any): Promise<any> {
    const db = trx || this.knex

    const existing = await this.getOne(tableName, { id }, trx)

    if (!existing) {
      throw throwError(404, `can't get the ${tableName} with id ${id}.`)
    }

    await db(tableName)
      .where({ id })
      .delete()

    return { ...existing, id: undefined }
  }

  public async executeSQL (sql: string, bindings?: any) {
    return bindings ? this.knex.raw(sql, bindings) : this.knex.raw(sql)
  }
}

/*
declare module 'fastify' {
  interface FastifyInstance {
    dataBasePlugin: DataBasePlugin
  }
}

// define plugin
const dataBasePlugin: FastifyPlugin = (fastify, options, done) => {
  fastify.decorate('dataBasePlugin', new DataBasePlugin())
  done()
}

export default fp(dataBasePlugin, '3.x')
*/
