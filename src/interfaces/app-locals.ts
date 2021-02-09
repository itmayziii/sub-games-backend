import * as Knex from 'knex'
import UserRepository from '../repositories/user.repository'
import ApprovedStreamerRepository from '../repositories/approvedStreamer.repository'
import SubGameSessionRepository from '../repositories/subGameSession.repository'
import getConfig from '../config'

export default interface AppLocals {
  config: ReturnType<typeof getConfig>
  db: Knex
  userRepository: ReturnType<typeof UserRepository>
  approvedStreamerRepository: ReturnType<typeof ApprovedStreamerRepository>
  subGameSessionRepository: ReturnType<typeof SubGameSessionRepository>
}
