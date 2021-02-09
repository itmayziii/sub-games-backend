import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  return await knex.schema
    .createTable('user', table => {
      table.string('id', 20).notNullable().primary()
      table.string('username', 255).notNullable().unique()
      table.string('refreshToken', 255).nullable().unique()
      table.string('twitchAccessToken', 255)
      table.string('twitchRefreshToken', 255)
      table.integer('twitchExpires').unsigned()
      table.integer('twitchIat').unsigned()
    })
}

export async function down (knex: Knex): Promise<void> {
  return await knex.schema
    .dropTable('user')
}
