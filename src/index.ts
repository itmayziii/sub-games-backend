import resolvers from './graphql/resolvers'
import makeApp from './app'
import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server-express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { loadTypeDefs } from './graphql/type-defs'
import AppLocals from './interfaces/app-locals'
import User from './interfaces/user'
import { GraphQLContext } from './interfaces/graphql'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

loadTypeDefs()
  .then(typeDefs => {
    const app = makeApp()

    const server = new ApolloServer({
      schema: makeExecutableSchema({
        typeDefs,
        resolvers
      }),
      context ({ req, res }) {
        const appLocals = req.app.locals as AppLocals
        const user = req.user as User | undefined

        const context: GraphQLContext = {
          config: appLocals.config,
          user,
          db: appLocals.db,
          userRepository: appLocals.userRepository,
          approvedStreamerRepository: appLocals.approvedStreamerRepository,
          subGameSessionRepository: appLocals.subGameSessionRepository,
          req,
          res
        }
        return context
      },
      playground: true
    })

    server.applyMiddleware({ app })

    app.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    )
  })
  .catch(error => console.error(error))
