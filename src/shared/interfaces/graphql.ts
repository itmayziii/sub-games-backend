import User from './models/user'
import * as Knex from 'knex'
import { Request, Response } from 'express'
import LoggerInterface from './logger'
import UserRepository from './repositories/user.repository'
import SubGameSessionRepository from './repositories/sub-game-session.repository'
import ApprovedStreamerRepository from './repositories/approved-streamer.repository'
import TwitchService from './services/twitch.service'
import Configuration from './config'
import DataLoader from 'dataloader'
import { JWTPayload } from './jwt'

export interface GraphQLContext {
  jwtPayload?: JWTPayload // Payload from JWT passed into the request.
  config: Configuration
  db: Knex
  userRepository: UserRepository
  approvedStreamerRepository: ApprovedStreamerRepository
  subGameSessionRepository: SubGameSessionRepository
  logger: LoggerInterface
  TwitchService: (user: User, clientId: string, clientSecret: string, logger: LoggerInterface) => TwitchService
  loaders: {
    userByIdLoader: DataLoader<string, User | null>
    userByUsernameLoader: DataLoader<string, User | null>
  }
  req: Request
  res: Response
}
