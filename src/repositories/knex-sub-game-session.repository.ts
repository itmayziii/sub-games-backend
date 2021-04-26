import * as Knex from 'knex'
import SubGameSession from '../interfaces/models/sub-game-session'
import User from '../interfaces/models/user'
import SubGameSessionQueue from '../interfaces/models/sub-game-session-queue'
import SubGameSessionRepository, { QueuedUser } from '../interfaces/repositories/sub-game-session.repository'

export default function KnexSubGameSessionRepository (db: Knex): SubGameSessionRepository {
  const repository: SubGameSessionRepository = {
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
    },
    async getLatestSessionForUsers (userIds) {
      return await db.from('subGameSession').innerJoin(
        db('subGameSession').select('ownerId').max('created_at', { as: 'maxCreatedAt' }).groupBy('ownerId').as('sgs2'),
        function () {
          this.on(function () {
            this.on('subGameSession.ownerId', '=', 'sgs2.ownerId')
            this.on('subGameSession.created_at', '=', 'sgs2.maxCreatedAt')
          })
        }
      ).whereIn('subGameSession.ownerId', userIds)
    }
  }

  return repository
}
