import knex from 'knex'
import getConfig from "../config";
import * as Knex from "knex";

let db: Knex
export default function getDB(): Knex {
  if (db) return db
  const config = getConfig()

  db = knex({
    client: 'pg',
    connection: {
      host: config.dbHost,
      user: 'subGamesCompanionApp',
      password: config.dbPassword,
      database: 'subGamesCompanion'
    }
  })

  db.on('query', data => {
    console.log('sql', data.sql)
  })

  return db
}
