import express from 'express'
import AppLocals from '../shared/interfaces/app-locals'
import KnexUserRepository from '../shared/repositories/knex-user.repository'
import KnexApprovedStreamerRepository from '../shared/repositories/knex-approved-streamer.repository'
import cookieParser from 'cookie-parser'
import KnexSubGameSessionRepository from '../shared/repositories/knex-sub-game-session.repository'
import Config from '../shared/config'
import getPassport from '../shared/passport'
import * as Knex from 'knex'
import cors from 'cors'
import authWithoutErrorMiddleware from '../shared/middleware/auth-without-error.middleware'
import TwitchService from '../shared/services/api-twitch.service'
import validateTwitchTokenMiddleware from '../shared/middleware/validate-twitch-token.middleware'
import WinstonLogger from '../shared/winston-logger'
import ResponseLocals from '../shared/interfaces/response-locals'
import UserByIdLoader from '../shared/loaders/user-by-id.loader'
import helmet from 'helmet'
import UserByUsernameLoader from '../shared/loaders/user-by-username.loader'
import getV1Router from './routes/v1-router'

export default function makeWebServer (db: Knex): express.Application {
  const app = express()
  const config = Config()
  const userRepository = KnexUserRepository(db)
  const appLocals: AppLocals = {
    config: Config(),
    db,
    userRepository,
    approvedStreamerRepository: KnexApprovedStreamerRepository(db),
    subGameSessionRepository: KnexSubGameSessionRepository(db),
    TwitchService,
    logger: WinstonLogger(config.logLevel)
  }
  app.locals = appLocals

  // https://github.com/helmetjs/helmet#readme
  // https://expressjs.com/en/advanced/best-practice-security.html
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'img-src': ["'self'", 'https://cdn.jsdelivr.net']
      }
    }
  }))

  // https://github.com/expressjs/cookie-parser#readme
  app.use(cookieParser())

  // https://github.com/expressjs/cors#readme
  app.use(cors({
    origin: [],
    credentials: true
  }))

  // https://github.com/jaredhanson/passport#readme
  const passport = getPassport(db, config, userRepository)
  app.use(passport.initialize())

  app.use((_, response, next) => {
    const responseLocals: ResponseLocals = {
      loaders: {
        userByIdLoader: UserByIdLoader(userRepository),
        userByUsernameLoader: UserByUsernameLoader(userRepository)
      }
    }
    response.locals = responseLocals
    next()
  })

  app.use('/graphql', authWithoutErrorMiddleware, validateTwitchTokenMiddleware)
  app.use('/v1', getV1Router(db, config, userRepository))

  return app
}
