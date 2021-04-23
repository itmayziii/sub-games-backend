import * as Knex from 'knex'
import UserRepository from '../repositories/user.repository'
import ApprovedStreamerRepository from '../repositories/approved-streamer.repository'
import SubGameSessionRepository from '../repositories/sub-game-session.repository'
import Config from '../config'

export default interface AppLocals {
  config: ReturnType<typeof Config>
  db: Knex
  userRepository: ReturnType<typeof UserRepository>
  approvedStreamerRepository: ReturnType<typeof ApprovedStreamerRepository>
  subGameSessionRepository: ReturnType<typeof SubGameSessionRepository>
}
