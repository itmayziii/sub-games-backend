import { RequestHandler } from "express";
import jwt from 'jsonwebtoken'
import AppLocals from "../interfaces/app-locals";
import User from "../interfaces/user";
import crypto from 'crypto'

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
        iss: 'sub-games-companion.com',
        aud: 'sub-games-companion.com',
        roles
      }, config.JWTSecretKey , { algorithm: 'HS256', expiresIn: 60 * 180 })
      res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 31556952, sameSite: 'strict' })
      res.cookie('accessToken', token, { httpOnly: false, maxAge: 31556952, sameSite: 'strict' })

      res.send('twitch callback handler')
    })
}

export default twitchCallbackHandler
