import connect from './resolvers/connect'

const resolvers = {
  Query: {
    ...connect.Query
  }
}

export default resolvers
