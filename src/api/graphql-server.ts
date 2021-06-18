import { ApolloServer, ExpressContext } from 'apollo-server-express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { SchemaDirectiveVisitor } from '@graphql-tools/utils'
import resolvers from './graphql/resolvers'
import { GraphQLContext } from '../shared/interfaces/graphql'
import express from 'express'
import { DocumentNode } from 'graphql'
import Logger from '../shared/interfaces/logger'
import ComplexityDirectiveVisitor from '../shared/graphql/directives/complexity.directive'
// @ts-expect-error - No @types for this package
import { constraintDirective } from 'graphql-constraint-directive'
import ComplexityPlugin from '../shared/graphql/plugins/complexity.plugin'

type ContextType = GraphQLContext | ((expressContext: ExpressContext) => GraphQLContext)
export default function makeGraphQLServer (app: express.Application, typeDefs: DocumentNode, context: ContextType, logger: Logger): ApolloServer {
  const schemaDirectives: Record<string, typeof SchemaDirectiveVisitor> = {
    complexity: ComplexityDirectiveVisitor
  }
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives,
    schemaTransforms: [constraintDirective()]
  })
  const server = new ApolloServer({
    schema,
    context,
    logger: {
      debug: logger.debug,
      info: logger.info,
      warn: logger.info,
      error: logger.error
    },
    plugins: [
      ComplexityPlugin(schema, logger)
    ],
    playground: true
  })

  server.applyMiddleware({
    app,
    cors: {
      origin: ['https://local.sub-games.com:3000', 'https://app.sub-games.com'],
      credentials: true
    }
  })

  return server
}
