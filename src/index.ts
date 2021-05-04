import makeWebServer from './web-server'
import dotenv from 'dotenv'
import { loadTypeDefs } from './graphql/type-defs'
import path from 'path'
import makeGraphQLServer from './graphql-server'
import DB from './database/database'
import context from './graphql/context'
import WinstonLogger from './winston-logger'
import Config from './config'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const config = Config()
const logger = WinstonLogger(config.logLevel)
const db = DB(logger)

Promise.all([loadTypeDefs(), db.migrate.latest({
  directory: path.resolve(__dirname, 'database/migrations')
})])
  .then(([typeDefs]) => {
    const webServer = makeWebServer(db)
    const graphQLServer = makeGraphQLServer(webServer, typeDefs, context)

    webServer.listen({ port: 4000 }, () => logger.info(`🚀 Server ready at http://localhost:4000${graphQLServer.graphqlPath}`))
  })
  .catch(error => {
    logger.error(error)
    throw error
  })
