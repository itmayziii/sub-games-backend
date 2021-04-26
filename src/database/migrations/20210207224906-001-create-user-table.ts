import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  return await knex.schema
    .createTable('user', table => {
      table.string('id', 20).notNullable().primary() // Twitch API refers to the ID as a string not an integer
      table.string('username', 255).notNullable().unique()
      table.string('refreshToken', 255).nullable().unique()
      table.string('twitchAccessToken', 255).nullable()
      table.string('twitchRefreshToken', 255).nullable()
      table.dateTime('lastTwitchValidation').nullable()
    })
}

export async function down (knex: Knex): Promise<void> {
  return await knex.schema
    .dropTable('user')
}
