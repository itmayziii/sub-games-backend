import { RequestHandler } from 'express'
import getPassport from '../passport'
import AppLocals from '../interfaces/app-locals'

const authWithoutErrorMiddleware: RequestHandler = function authWithoutError (request, response, next) {
  const { db, config, userRepository } = request.app.locals as AppLocals
  const passport = getPassport(db, config, userRepository)
  passport.authenticate('jwt', (error, payload) => {
    if (error !== null) return next(error)
    const jwtPayload = (payload === null || payload === undefined) ? undefined : payload
    response.locals = { ...response.locals, jwtPayload }
    next()
  })(request, response, next)
}

export default authWithoutErrorMiddleware
