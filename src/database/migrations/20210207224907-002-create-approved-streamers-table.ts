import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('approvedStreamer', table => {
      table.string('id', 20).notNullable().primary()
    })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('approvedStreamer')
}
