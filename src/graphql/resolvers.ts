import { MutationResolvers } from '../generated/graphql'
import { ApolloError } from 'apollo-server-express'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import subGameSessionResolver from './resolvers/sub-game-session.resolver'
import nodeResolver from './resolvers/node.resolver'

const refreshToken: MutationResolvers['refreshToken'] = async (_, { input = {} }, { req, user, res, approvedStreamerRepository, userRepository, config }) => {
  let refreshToken = req.cookies.refreshToken
  if (input?.refreshToken !== undefined) {
    refreshToken = input.refreshToken
  }

  if (refreshToken === undefined) {
    throw new ApolloError('Missing refresh token')
  }

  return await userRepository.findByRefreshToken(refreshToken)
    .then(async user => {
      if (user === undefined) {
        throw new ApolloError('No user by refresh token')
      }

      let roles: string[] = []
      const newRefreshToken = crypto.randomBytes(36).toString('hex')
      return await Promise.all([
        approvedStreamerRepository.isStreamerApproved(user.id),
        userRepository.update(user.id, { refreshToken: newRefreshToken })
      ])
        .then(([isStreamerApproved]) => {
          if (isStreamerApproved) {
            roles = [...roles, 'game-creator']
          }

          const token = jwt.sign({
            sub: user.id,
            iss: 'sub-games-companion.com',
            aud: 'sub-games-companion.com',
            roles
          }, config.JWTSecretKey, { algorithm: 'HS256', expiresIn: 60 * 180 })
          const oneYearInMilliseconds = 31540000000
          res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: oneYearInMilliseconds, sameSite: 'strict' })
          res.cookie('accessToken', token, { httpOnly: false, maxAge: oneYearInMilliseconds, sameSite: 'strict' })

          return {
            success: true
          }
        })
    })
}

const resolvers = {
  Query: {
    ...nodeResolver.Query,
    ...subGameSessionResolver.Query
  },
  Mutation: {
    refreshToken,
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
