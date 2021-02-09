import express from 'express'
import AppLocals from "./interfaces/app-locals";
import UserRepository from "./repositories/user.repository";
import ApprovedStreamerRepository from "./repositories/approvedStreamer.repository";
import cookieParser from 'cookie-parser'
import getV1Router from "./routes/v1-router";
import SubGameSessionRepository from "./repositories/subGameSession.repository";
import getConfig from "./config";
import getDB from "./database/database";
import getPassport from "./passport";

export default function makeApp (): express.Application {
  const app = express();
  const db = getDB()
  const appLocals: AppLocals = {
    config: getConfig(),
    db,
    userRepository: UserRepository(db),
    approvedStreamerRepository: ApprovedStreamerRepository(db),
    subGameSessionRepository: SubGameSessionRepository(db)
  }
  app.locals = appLocals
  app.use(cookieParser())

  const passport = getPassport()
  app.use(passport.initialize())

  app.use('/graphql', function authWithoutError(req, res, next) {
    passport.authenticate('jwt', (error, user) => {
      if (error) return next(error)
      req.user = user
      next()
    })(req, res, next)
  })

  app.use('/v1', getV1Router())

  return app
}
