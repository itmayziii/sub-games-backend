import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('subGameSession', table => {
      table.increments('id').notNullable().primary()
      table.dateTime('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now())
      table.dateTime('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now())
      table.string('ownerId', 20).notNullable().references('id').inTable('user')
      table.boolean('isActive').notNullable()
      table.boolean('userMustVerifyEpic').notNullable().defaultTo(false)
      table.integer('maxPlayCount').unsigned().nullable().defaultTo(1)
      table.integer('maxActivePlayers').unsigned().notNullable().defaultTo(3)
      table.boolean('onlyAllowSubs').notNullable().defaultTo(true)
    })
    .createTable('userSubGameSessionQueue', table => {
      table.increments('id').notNullable().primary()
      table.string('userId', 20).notNullable().references('id').inTable('user')
      table.integer('subGameSessionId').unsigned().notNullable().references('id').inTable('subGameSession')
      table.dateTime('joinedAt', { useTz: false }).notNullable().defaultTo(knex.fn.now())
      table.integer('order').unsigned().notNullable()

      table.unique(['userId', 'subGameSessionId'])
    })
    .createTable('userSubGameSessionActive', table => {
      table.increments('id').notNullable().primary()
      table.string('userId', 20).notNullable().references('id').inTable('user')
      table.integer('subGameSessionId').unsigned().notNullable().references('id').inTable('subGameSession')
      table.dateTime('joinedAt', { useTz: false }).notNullable().defaultTo(knex.fn.now())

      table.unique(['userId', 'subGameSessionId'])
    })
    .createTable('userSubGameSessionHistory', table => {
      table.increments('id').notNullable().primary()
      table.string('userId', 20).notNullable().references('id').inTable('user')
      table.integer('subGameSessionId').unsigned().notNullable().references('id').inTable('subGameSession')
      table.dateTime('playedFrom', { useTz: false }).notNullable()
      table.dateTime('playedTo', { useTz: false }).notNullable().defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('userSubGameSessionQueue')
    .dropTable('userSubGameSessionActive')
    .dropTable('userSubGameSessionHistory')
    .dropTable('subGameSession')
}
