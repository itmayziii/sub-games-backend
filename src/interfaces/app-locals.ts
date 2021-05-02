import * as Knex from 'knex'
import LoggerInterface from '../interfaces/logger'
import UserRepository from '../interfaces/repositories/user.repository'
import SubGameSessionRepository from '../interfaces/repositories/sub-game-session.repository'
import ApprovedStreamerRepository from '../interfaces/repositories/approved-streamer.repository'
import TwitchService from '../interfaces/services/twitch.service'
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
