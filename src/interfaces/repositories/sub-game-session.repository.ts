import { MakeMaybe } from '../../generated/graphql'
import SubGameSession from '../models/sub-game-session'
import User from '../models/user'
import SubGameSessionQueue from '../models/sub-game-session-queue'

export type StartSubGameSessionInput = MakeMaybe<Omit<SubGameSession, 'isActive' | 'id'>, 'maxActivePlayers' | 'maxPlayCount' | 'userMustVerifyEpic' | 'isSubOnly'>
export type QueuedUser = User & { order: number }
export default interface SubGameSessionRepository {
  startSession: (subGameSession: StartSubGameSessionInput) => Promise<SubGameSession>
  hasActiveSession: (ownerId: string) => Promise<Boolean>
  find: (id: number) => Promise<SubGameSession | undefined>
  joinSession: (user: User, session: SubGameSession) => Promise<void>
  isUserPartOfSession: (user: User, session: SubGameSession) => Promise<boolean>
  findActiveSessionByUser: (user: User) => Promise<SubGameSession | undefined>
  getQueuedPlayersForSession: (session: SubGameSession) => Promise<QueuedUser[]>
  getPlayerHistoryForSession: (session: SubGameSession) => Promise<User[]>
  getActivePlayersForSession: (session: SubGameSession) => Promise<User[]>
  moveUserInSessionQueue: (session: SubGameSession, user: User, order: number) => Promise<void>
  getSessionQueueForUser: (session: SubGameSession, user: User) => Promise<SubGameSessionQueue | undefined>
  getLatestSessionForUsers: (userIds: string[]) => Promise<SubGameSession[]>
}
