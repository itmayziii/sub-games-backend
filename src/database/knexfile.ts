import path from 'path'
import dotenv from 'dotenv'
import Config from '../config'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })
const config = Config()

export default {
  client: 'pg',
  connection: {
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbDatabase
  },
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
    extension: 'ts'
  }
}
