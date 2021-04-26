import { ApolloServer, ExpressContext } from 'apollo-server-express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import resolvers from './graphql/resolvers'
import { GraphQLContext } from './interfaces/graphql'
import express from 'express'
import { DocumentNode } from 'graphql'

type ContextType = GraphQLContext | ((expressContext: ExpressContext) => GraphQLContext)
export default function makeGraphQLServer (app: express.Application, typeDefs: DocumentNode, context: ContextType): ApolloServer {
  const server = new ApolloServer({
    schema: makeExecutableSchema({
      typeDefs,
      resolvers
    }),
    context,
    playground: true
  })

  server.applyMiddleware({
    app,
    cors: {
      origin: ['http://localhost:3000'],
      credentials: true
    }
  })

  return server
}
