import { MutationResolvers } from '../../generated/graphql'
import { ApolloError } from 'apollo-server-express'
import crypto from 'crypto'
import { signJWT } from '../../utilities'

const refreshToken: MutationResolvers['refreshToken'] = async (
  _,
  { input = {} },
  {
    req,
    res,
    approvedStreamerRepository,
    userRepository,
    config
  }) => {
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

      const newRefreshToken = crypto.randomBytes(36).toString('hex')
      return await Promise.all([
        approvedStreamerRepository.isStreamerApproved(user.id),
        userRepository.update(user.id, { refreshToken: newRefreshToken })
      ])
        .then(([isStreamerApproved]) => {
          const token = signJWT(user, config.JWTSecretKey, isStreamerApproved)
          const oneYearInMilliseconds = 31540000000
          res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: oneYearInMilliseconds, sameSite: 'strict' })
          res.cookie('accessToken', token, { httpOnly: false, maxAge: oneYearInMilliseconds, sameSite: 'strict' })

          return {
            success: true
          }
        })
    })
}

export default {
  Mutation: {
    refreshToken
  }
}
