import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  return await knex.schema
    .createTable('oauthState', table => {
      table.string('id', 255).notNullable().primary()
    })
}

export async function down (knex: Knex): Promise<void> {
  return await knex.schema
    .dropTable('oauthState')
}
