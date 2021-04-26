import subGameSessionResolver from './resolvers/sub-game-session.resolver'
import nodeResolver from './resolvers/node.resolver'
import tokenResolver from './resolvers/token.resolver'
import sessionResolver from './resolvers/session.resolver'

const resolvers = {
  Query: {
    ...nodeResolver.Query,
    ...subGameSessionResolver.Query,
    ...sessionResolver.Query
  },
  Mutation: {
    ...tokenResolver.Mutation,
    ...subGameSessionResolver.Mutation
  },
  Node: {
    ...nodeResolver.Node
  },
  SubGameSession: {
    ...subGameSessionResolver.SubGameSession
  }
}

export default resolvers
