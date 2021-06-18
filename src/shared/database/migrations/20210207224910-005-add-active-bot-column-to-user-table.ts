import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  return await knex.schema
    .table('user', table => {
      table.boolean('isActiveBot').notNullable().defaultTo(false)
    })
}

export async function down (knex: Knex): Promise<void> {
  return await knex.schema
    .table('user', table => {
      table.dropColumn('isActiveBot')
    })
}
