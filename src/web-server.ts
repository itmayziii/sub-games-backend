import express from 'express'
import AppLocals from './interfaces/app-locals'
import KnexUserRepository from './repositories/knex-user.repository'
import KnexApprovedStreamerRepository from './repositories/knex-approved-streamer.repository'
import cookieParser from 'cookie-parser'
import getV1Router from './routes/v1-router'
import KnexSubGameSessionRepository from './repositories/knex-sub-game-session.repository'
import Config from './config'
import getPassport from './passport'
import * as Knex from 'knex'
import cors from 'cors'
import authWithoutErrorMiddleware from './middleware/auth-without-error.middleware'
import TwitchService from './services/api-twitch.service'
import validateTwitchTokenMiddleware from './middleware/validate-twitch-token.middleware'
import WinstonLogger from './winston-logger'
import ResponseLocals from './interfaces/response-locals'
import UserByIdLoader from './loaders/user.loader'
import DataLoader from 'dataloader'

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

  app.use(cookieParser())
  app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
  }))

  const passport = getPassport(db, config, userRepository)
  app.use(passport.initialize())

  app.use((_, response, next) => {
    const responseLocals: ResponseLocals = {
      loaders: {
        userByIdLoader: new DataLoader(UserByIdLoader(userRepository))
      }
    }
    response.locals = responseLocals
    next()
  })

  app.use('/graphql', authWithoutErrorMiddleware, validateTwitchTokenMiddleware)
  app.use('/v1', getV1Router(db, config, userRepository))

  return app
}
