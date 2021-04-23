import express from 'express'
import AppLocals from './interfaces/app-locals'
import UserRepository from './repositories/user.repository'
import ApprovedStreamerRepository from './repositories/approved-streamer.repository'
import cookieParser from 'cookie-parser'
import getV1Router from './routes/v1-router'
import SubGameSessionRepository from './repositories/sub-game-session.repository'
import Config from './config'
import getPassport from './passport'
import * as Knex from 'knex'

export default function makeWebServer (db: Knex): express.Application {
  const app = express()
  const appLocals: AppLocals = {
    config: Config(),
    db,
    userRepository: UserRepository(db),
    approvedStreamerRepository: ApprovedStreamerRepository(db),
    subGameSessionRepository: SubGameSessionRepository(db)
  }
  app.locals = appLocals
  app.use(cookieParser())

  const passport = getPassport()
  app.use(passport.initialize())

  app.use('/graphql', function authWithoutError (req, res, next) {
    passport.authenticate('jwt', (error, user) => {
      if (error !== null) return next(error)
      req.user = (user === null || user === undefined || user === false) ? undefined : user
      next()
    })(req, res, next)
  })

  app.use('/v1', getV1Router())

  return app
}
