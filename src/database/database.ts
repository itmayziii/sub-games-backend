import knex from 'knex'
import getConfig from '../config'
import * as Knex from 'knex'

let db: Knex | null = null
export default function getDB (): Knex {
  if (db !== null) return db
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
    console.log('bindings', data.bindings)
  })

  return db
}
