import { QueryResolvers } from '../../generated/graphql'

const connectToIRC: QueryResolvers['connectToIRC'] = async (_, { userId }) => {
  return {}
}

export default {
  Query: {
    connectToIRC
  }
}
