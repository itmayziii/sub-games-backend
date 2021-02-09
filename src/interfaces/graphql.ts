import User from './user'
import * as Knex from 'knex'
import UserRepository from '../repositories/user.repository'
import ApprovedStreamerRepository from '../repositories/approvedStreamer.repository'
import { Request, Response } from 'express'
import SubGameSessionRepository from '../repositories/subGameSession.repository'
import getConfig from '../config'

export interface GraphQLContext {
  user?: User
  config: ReturnType<typeof getConfig>
  db: Knex
  userRepository: ReturnType<typeof UserRepository>
  approvedStreamerRepository: ReturnType<typeof ApprovedStreamerRepository>
  subGameSessionRepository: ReturnType<typeof SubGameSessionRepository>
  req: Request
  res: Response
}
