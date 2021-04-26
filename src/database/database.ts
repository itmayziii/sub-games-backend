import knex from 'knex'
import Config from '../config'
import * as Knex from 'knex'
import Logger from '../interfaces/logger'

let db: Knex
export default function DB (logger: Logger): Knex {
  if (db !== undefined) return db
  const config = Config()

  db = knex({
    client: 'pg',
    connection: {
      host: config.dbHost,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbDatabase
    }
  })

  db.on('query', (data: Knex.Sql) => {
    logger.info(`SQL - ${data.sql}`)
    logger.info(`SQL Bindings - ${data.bindings.toString()}`)
  })

  return db
}
