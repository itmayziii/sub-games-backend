import * as Knex from 'knex'
import LoggerInterface from './logger'
import UserRepository from './repositories/user.repository'
import SubGameSessionRepository from './repositories/sub-game-session.repository'
import ApprovedStreamerRepository from './repositories/approved-streamer.repository'
import TwitchService from './services/twitch.service'
import User from './models/user'
import Configuration from './config'

// http://expressjs.com/en/api.html#app.locals
export default interface AppLocals {
  config: Configuration
  db: Knex
  userRepository: UserRepository
  approvedStreamerRepository: ApprovedStreamerRepository
  subGameSessionRepository: SubGameSessionRepository
  TwitchService: (user: User, clientId: string, clientSecret: string, logger: LoggerInterface) => TwitchService
  logger: LoggerInterface
}
