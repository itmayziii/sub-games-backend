import { RequestHandler } from 'express'
import User from '../../shared/interfaces/models/user'
import getPassport from '../../shared/passport'
import AppLocals from '../../shared/interfaces/app-locals'

const loginHandler: RequestHandler = function loginHandler (request, response, next) {
  const { db, config, userRepository } = response.app.locals as AppLocals
  const passport = getPassport(db, config, userRepository)

  passport.authenticate('jwt', (error: Error | undefined, user: User | false) => {
    if (error !== null) return next(error)

    const redirectURLQueryParam = request.query.redirect_url
    let redirectURL = `${config.webAppURL}/sessions`
    if (typeof redirectURLQueryParam === 'string') {
      redirectURL = redirectURLQueryParam
    }

    if (user === false) return response.redirect(`/v1/login/oauth2/twitch?redirect_url=${redirectURL}`)

    request.login(user, { session: false }, error => {
      if (error !== undefined) return next(error)
      return response.redirect(redirectURL)
    })
  })(request, response, next)
}

export default loginHandler
