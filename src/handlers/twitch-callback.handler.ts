import { RequestHandler } from 'express'
import AppLocals from '../interfaces/app-locals'
import User from '../interfaces/models/user'
import crypto from 'crypto'
import { signJWT } from '../utilities'
import { fromGlobalId } from 'graphql-relay'

const twitchCallbackHandler: RequestHandler = (request, response) => {
  const { approvedStreamerRepository, userRepository, config, logger } = request.app.locals as AppLocals
  const user = request.user as User

  const refreshToken = crypto.randomBytes(36).toString('hex')
  Promise.all([
    approvedStreamerRepository.isStreamerApproved(user.id),
    userRepository.update(user.id, { refreshToken })
  ])
    .then(([isStreamerApproved]) => {
      const token = signJWT(user, config.JWTSecretKey, isStreamerApproved)
      const oneYearInMilliseconds = 31540000000
      response.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: oneYearInMilliseconds, sameSite: 'strict' })
      response.cookie('accessToken', token, { httpOnly: false, maxAge: oneYearInMilliseconds, sameSite: 'strict' })

      const stateQuery = request.query.state
      if (typeof stateQuery !== 'string') {
        return response.redirect(`${config.webAppURL}/sessions`)
      }
      const { id: redirectURL } = fromGlobalId(stateQuery)
      response.redirect(redirectURL)
    })
    .catch(error => {
      logger.error(error.message)
      response.status(500).end()
    })
}

export default twitchCallbackHandler
