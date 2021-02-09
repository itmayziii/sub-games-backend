import {MutationResolvers} from "../generated/graphql";
import { ApolloError } from 'apollo-server-express'
import crypto from "crypto";
import jwt from "jsonwebtoken";
import subGameSessionResolver from './resolvers/sub-game-session.resolver'

const posts = ['']

const refreshToken: MutationResolvers['refreshToken'] = (_, { input= {} }, { req, user, res, approvedStreamerRepository, userRepository, config }) => {
  let refreshToken = req.cookies['refreshToken']
  if (input && input.refreshToken) {
    refreshToken = input.refreshToken
  }

  if (!refreshToken) {
    throw new ApolloError('Missing refresh token')
  }

  return userRepository.findByRefreshToken(refreshToken)
    .then(user => {
      if (!user) {
        throw new ApolloError('No user by refresh token')
      }

      let roles: string[] = []
      const newRefreshToken = crypto.randomBytes(36).toString('hex')
      return Promise.all([
        approvedStreamerRepository.isStreamerApproved(user.id),
        userRepository.update(user.id, { refreshToken: newRefreshToken })
      ])
        .then(([isStreamerApproved]) => {
          if (isStreamerApproved) {
            roles = [...roles, 'game-creator']
          }

          const token = jwt.sign({
            iss: 'sub-games-companion.com',
            aud: 'sub-games-companion.com',
            roles
          }, config.JWTSecretKey, { algorithm: 'HS256', expiresIn: 60 * 180 })
          res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 31556952, sameSite: 'strict' })
          res.cookie('accessToken', token, { httpOnly: false, maxAge: 31556952, sameSite: 'strict' })

          return {
            success: true
          }
        })
    })
}

const resolvers = {
  Query: {
    ...subGameSessionResolver.Query
  },
  Mutation: {
    refreshToken,
    ...subGameSessionResolver.Mutation
  },
  SubGameSession: {
    ...subGameSessionResolver.SubGameSession
  }
};

export default resolvers;
