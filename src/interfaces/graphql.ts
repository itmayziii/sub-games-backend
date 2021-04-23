import User from './user'
import * as Knex from 'knex'
import UserRepository from '../repositories/user.repository'
import ApprovedStreamerRepository from '../repositories/approved-streamer.repository'
import { Request, Response } from 'express'
import SubGameSessionRepository from '../repositories/sub-game-session.repository'
import Config from '../config'

export interface GraphQLContext {
  user?: User
  config: ReturnType<typeof Config>
  db: Knex
  userRepository: ReturnType<typeof UserRepository>
  approvedStreamerRepository: ReturnType<typeof ApprovedStreamerRepository>
  subGameSessionRepository: ReturnType<typeof SubGameSessionRepository>
  req: Request
  res: Response
}
