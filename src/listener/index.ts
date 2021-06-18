import makeWebServer from './web-server'
import dotenv from 'dotenv'
import { loadTypeDefs } from './graphql/type-defs'
import path from 'path'
import makeGraphQLServer from './graphql-server'
import DB from '../shared/database/database'
import context from '../shared/graphql/context'
import WinstonLogger from '../shared/winston-logger'
import Config from '../shared/config'
import ircClients, { connect } from './irc-clients'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const config = Config()
const logger = WinstonLogger(config.logLevel)
const db = DB(logger)

Promise.all([loadTypeDefs(), db.migrate.latest({
  directory: path.resolve(__dirname, '../shared/database/migrations')
})])
  .then(([typeDefs]) => {
    const webServer = makeWebServer(db)
    const graphQLServer = makeGraphQLServer(webServer, typeDefs, context, logger)

    connect('reactiveangular', config, logger)
    webServer.listen({ port: 4100 }, () => logger.info(`🚀 Server ready at https://local-listener.sub-games.com${graphQLServer.graphqlPath}`))
  })
  .catch(error => {
    logger.error(error)
    throw error
  })

process.on('SIGINT', () => {
  let clientDisconnects: Array<Promise<[string, any]>> = []
  for (const key in ircClients) {
    const client = ircClients[key]
    const disconnect = client.disconnect()
    clientDisconnects = [...clientDisconnects, disconnect]
  }

  Promise.all<unknown>([...clientDisconnects, db.destroy()])
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
})
