import path from 'path'
import dotenv from 'dotenv'
import Config from '../config'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })
const config = Config()

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
