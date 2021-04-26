import User from './models/user'
import * as Knex from 'knex'
import { Request, Response } from 'express'
import LoggerInterface from './logger'
import UserRepository from './repositories/user.repository'
import SubGameSessionRepository from './repositories/sub-game-session.repository'
import ApprovedStreamerRepository from './repositories/approved-streamer.repository'
import TwitchService from './services/twitch.service'
import Configuration from './config'

export interface GraphQLContext {
  user?: User
  config: Configuration
  db: Knex
  userRepository: UserRepository
  approvedStreamerRepository: ApprovedStreamerRepository
  subGameSessionRepository: SubGameSessionRepository
  logger: LoggerInterface
  TwitchService: (user: User, clientId: string, clientSecret: string, logger: LoggerInterface) => TwitchService
  req: Request
  res: Response
}
