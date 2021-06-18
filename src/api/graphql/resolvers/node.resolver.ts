import { NodeResolvers, QueryResolvers } from '../../generated/graphql'
import { fromGlobalId } from 'graphql-relay'
import { ApolloError } from 'apollo-server-express'
import subGameSessionResolver from './sub-game-session.resolver'

const nodeResolveType: NodeResolvers['__resolveType'] = async (entity) => {
  if (entity.__typename === undefined) {
    throw new ApolloError('Type is likely not queryable with the "node" query.')
  }
  return entity.__typename
}

const node: QueryResolvers['node'] = async (_, { id }, context, info) => {
  const { type } = fromGlobalId(id)
  switch (type) {
    case 'SubGameSession':
      return await Promise.resolve(subGameSessionResolver.Query.subGameSessionById(_, { input: { id } }, context, info))
        // @ts-expect-error - it is not clear why "subGameSession" is not seen as a property
        .then(data => data.subGameSession)
    default:
      throw new ApolloError(`Type - ${type} - cannot be queried with the "node" query.`)
  }
}

export default {
  Query: {
    node
  },
  Node: {
    __resolveType: nodeResolveType
  }
}
