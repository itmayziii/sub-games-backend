import { RequestHandler } from 'express'
import getPassport from '../passport'
import AppLocals from '../interfaces/app-locals'

const authWithoutErrorMiddleware: RequestHandler = function authWithoutError (req, res, next) {
  const { db, config, userRepository } = req.app.locals as AppLocals
  const passport = getPassport(db, config, userRepository)
  passport.authenticate('jwt', (error, user) => {
    if (error !== null) return next(error)
    req.user = (user === null || user === undefined || user === false) ? undefined : user
    next()
  })(req, res, next)
}

export default authWithoutErrorMiddleware
