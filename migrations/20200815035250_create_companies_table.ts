import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('companies')

  if (exists) return

  return knex.schema.createTable('companies', (table: Knex.CreateTableBuilder) => {
    table.increments('id')
    table.string('name', 100).unique()
    table.uuid('uuid').unique()
    table.json('service_account').notNullable()
    table.timestamps(true, true)
  })
}

export async function down (knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('companies')

  if (!exists) return

  return knex.schema.dropTable('companies')
}
