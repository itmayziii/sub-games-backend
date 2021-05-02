import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import AppLocals from '../interfaces/app-locals'
import User from '../interfaces/models/user'
import crypto from 'crypto'
import { toGlobalId } from 'graphql-relay'

const twitchCallbackHandler: RequestHandler = (req, res) => {
  const { approvedStreamerRepository, userRepository, config } = req.app.locals as AppLocals
  const user = req.user as User

  let roles: string[] = []
  const refreshToken = crypto.randomBytes(36).toString('hex')
  Promise.all([
    approvedStreamerRepository.isStreamerApproved(user.id),
    userRepository.update(user.id, { refreshToken })
  ])
    .then(([isStreamerApproved]) => {
      if (isStreamerApproved) {
        roles = [...roles, 'game-creator']
      }

      const token = jwt.sign({
        sub: toGlobalId('User', user.id),
        iss: 'sub-games-companion.com',
        aud: 'sub-games-companion.com',
        roles
      }, config.JWTSecretKey, { algorithm: 'HS256', expiresIn: 60 * 180 })
      const oneYearInMilliseconds = 31540000000
      res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: oneYearInMilliseconds, sameSite: 'strict' })
      res.cookie('accessToken', token, { httpOnly: false, maxAge: oneYearInMilliseconds, sameSite: 'strict' })

      res.send('twitch callback handler')
    })
    .catch(error => {
      console.error(error)
      throw error
    })
}

export default twitchCallbackHandler
