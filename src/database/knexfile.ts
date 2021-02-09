import path from 'path'
import dotenv from 'dotenv'
import getConfig from '../config'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })
const config = getConfig()

export default {
  client: 'pg',
  connection: {
    host: config.dbHost,
    user: 'subGamesCompanionApp',
    password: config.dbPassword,
    database: 'subGamesCompanion'
  },
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
    extension: 'ts'
  }
}
