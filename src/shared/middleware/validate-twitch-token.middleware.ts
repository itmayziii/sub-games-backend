import { RequestHandler } from 'express'
import User from '../interfaces/models/user'
import dayjs from 'dayjs'
import AppLocals from '../interfaces/app-locals'

const validateTwitchTokenMiddleware: RequestHandler = function validateTwitchTokenMiddleware (req, res, next) {
  const user = req.user as User | undefined
  if (user === undefined || user.twitchAccessToken === null || user.twitchRefreshToken === null) {
    return next()
  }

  if (user.lastTwitchValidation === null) {
    return next()
  }

  const lastTwitchValidation = dayjs(user.lastTwitchValidation)
  const now = dayjs()
  // Twitch says we should validate every hour https://dev.twitch.tv/docs/authentication#validating-requests.
  if (now.diff(lastTwitchValidation, 'minute') < 59) {
    return next()
  }

  const { userRepository, TwitchService, config, logger, db } = req.app.locals as AppLocals
  const twitchService = TwitchService(user, config.twitchClientId, config.twitchClientSecret, logger)
  twitchService.validateAccessToken(user.twitchAccessToken)
    .then((isAccessTokenValid): void | Promise<void> => {
      if (isAccessTokenValid) {
        return userRepository.update(user.id, { lastTwitchValidation: db.fn.now() })
          .then(user => {
            req.user = user
            next()
          })
      }

      if (user.twitchRefreshToken === null) {
        return next() // TODO also clear out all twitch credentials to be safe
      }

      return twitchService.refreshAccessToken(user.twitchRefreshToken)
        .then(async ({ accessToken, refreshToken }) => {
          return await userRepository.update(user.id, {
            twitchAccessToken: accessToken,
            twitchRefreshToken: refreshToken,
            lastTwitchValidation: db.fn.now()
          })
            .then(user => {
              req.user = user
              next()
            })
        })
        .catch(async () => {
          return await userRepository.update(user.id, {
            twitchAccessToken: undefined,
            twitchRefreshToken: undefined,
            lastTwitchValidation: undefined
          })
            .then(user => {
              req.user = user
              next()
            })
        })
    })
    .catch(error => {
      logger.error(error.message)
      next(error) // TODO figure out error handling for middleware
    })
}

export default validateTwitchTokenMiddleware
