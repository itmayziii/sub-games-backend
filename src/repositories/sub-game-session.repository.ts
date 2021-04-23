import * as Knex from 'knex'
import SubGameSession from '../interfaces/sub-game-session'
import { MakeMaybe } from '../generated/graphql'
import User from '../interfaces/user'
import SubGameSessionQueue from '../interfaces/sub-game-session-queue'

type StartSubGameSessionInput = MakeMaybe<Omit<SubGameSession, 'isActive' | 'id'>, 'maxActivePlayers' | 'maxPlayCount' | 'userMustVerifyEpic' | 'isSubOnly'>
type QueuedUser = User & { order: number }

interface SubGameSessionRepo {
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
}

export default function SubGameSessionRepository (db: Knex): SubGameSessionRepo {
  const repository: SubGameSessionRepo = {
    async startSession (subGameSession) {
      return await repository.hasActiveSession(subGameSession.ownerId)
        .then(async hasActiveSession => {
          if (hasActiveSession === true) throw new Error('User already has active session')

          return await db('subGameSession')
            .returning('*')
            .insert<SubGameSession[]>({
            ...subGameSession,
            isActive: true
          })
            .then(results => results[0])
        })
    },
    async hasActiveSession (ownerId) {
      return await db('subGameSession').count<Array<{ count: number }>>('id').where({ ownerId, isActive: true })
        .then(result => {
          if (result[0] === undefined) return false
          return result[0].count > 0
        })
    },
    async find (id) {
      return await db<SubGameSession>('subGameSession').first().where({ id })
    },
    async joinSession (user, session) {
      if (user.id === session.ownerId) {
        throw new Error('Session owner can not join their own session')
      }

      return await repository.isUserPartOfSession(user, session)
        .then(async isUserPartOfSession => {
          if (isUserPartOfSession) {
            throw new Error('User is already part of session')
          }

          await db.transaction(async trx => {
            return await trx<{ order: number }>('userSubGameSessionQueue')
              .select('order')
              .forUpdate()
              .orderBy('order', 'desc')
              .limit(1)
              .first()
              .then(lastOrderRow => {
                let order = 0
                if (lastOrderRow !== undefined) {
                  order = lastOrderRow.order + 1
                }

                return trx('userSubGameSessionQueue').insert({ userId: user.id, subGameSessionId: session.id, order })
              })
              .then(trx.commit)
              .catch(trx.rollback)
          })
        })
    },
    async isUserPartOfSession (user, session) {
      if (!session.isActive) return await Promise.resolve(false)
      if (user.id === session.ownerId) return await Promise.resolve(false)

      return await db('userSubGameSessionQueue').count<Array<{ count: number }>>('id').where({ userId: user.id, subGameSessionId: session.id })
        .then(result => {
          if (result[0] === undefined) return false
          return result[0].count > 0
        })
    },
    async findActiveSessionByUser (user) {
      return await db<SubGameSession>('subGameSession').first().where({ ownerId: user.id, isActive: true })
    },
    async getQueuedPlayersForSession (session) {
      if (!session.isActive) throw new Error('No queue for inactive sessions')

      return await db.select<QueuedUser[]>('user.*', 'userSubGameSessionQueue.order')
        .from('userSubGameSessionQueue')
        .where({ subGameSessionId: session.id })
        .join('user', 'user.id', 'userSubGameSessionQueue.userId')
        .orderBy('userSubGameSessionQueue.order', 'asc')
        .then(results => results)
    },
    async getPlayerHistoryForSession (session) {
      return await db.select<User[]>('user.*')
        .from('userSubGameSessionHistory')
        .where({ subGameSessionId: session.id })
        .join('user', 'user.id', 'userSubGameSessionHistory.userId')
        .then(results => results)
    },
    async getActivePlayersForSession (session) {
      return await db.select<User[]>('user.*')
        .from('userSubGameSessionActive')
        .where({ subGameSessionId: session.id })
        .join('user', 'user.id', 'userSubGameSessionActive.userId')
        .then(results => results)
    },
    async getSessionQueueForUser (session, user) {
      return await db<SubGameSessionQueue>('userSubGameSessionQueue')
        .where({ subGameSessionId: session.id, userId: user.id })
        .first()
        .then(result => result)
    },
    async moveUserInSessionQueue (session, user, order) {
      await repository.getSessionQueueForUser(session, user)
        .then(async sessionQueue => {
          if (sessionQueue === undefined) {
            throw new Error('User is not part of session')
          }

          if (sessionQueue.order === order) {
            return
          }

          return await db.transaction(async trx => {
            return await trx('userSubGameSessionQueue').increment('order', 1).where('order', '>=', order)
              .then(async () => {
                return await trx('userSubGameSessionQueue')
                  .update({ order })
                  .where({ subGameSessionId: session.id, userId: user.id })
              })
              .then(trx.commit)
              .catch(trx.rollback)
          })
        })
    }
  }

  return repository
}
