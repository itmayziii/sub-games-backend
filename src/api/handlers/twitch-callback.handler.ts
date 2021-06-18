import { RequestHandler } from 'express'
import AppLocals from '../../shared/interfaces/app-locals'
import crypto from 'crypto'
import { signJWT } from '../../shared/utilities'
import { fromGlobalId } from 'graphql-relay'
import ResponseLocals from '../../shared/interfaces/response-locals'

const twitchCallbackHandler: RequestHandler = (request, response) => {
  const { approvedStreamerRepository, userRepository, config, logger } = request.app.locals as AppLocals
  const { jwtPayload } = response.locals as ResponseLocals

  if (jwtPayload === undefined) {
    response.status(401).end()
    return
  }

  const { id: userId } = fromGlobalId(jwtPayload.sub)
  const refreshToken = crypto.randomBytes(36).toString('hex')
  Promise.all([
    approvedStreamerRepository.isStreamerApproved(userId),
    userRepository.update(userId, { refreshToken })
  ])
    .then(([isStreamerApproved]) => {
      const token = signJWT(jwtPayload.sub, jwtPayload['https://sub-games.com/username'], config.JWTSecretKey, isStreamerApproved)
      const oneYearInMilliseconds = 31540000000
      response.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: oneYearInMilliseconds, sameSite: 'strict', secure: true, domain: 'sub-games.com' })
      response.cookie('accessToken', token, { httpOnly: false, maxAge: oneYearInMilliseconds, sameSite: 'strict', secure: true, domain: 'sub-games.com' })

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
