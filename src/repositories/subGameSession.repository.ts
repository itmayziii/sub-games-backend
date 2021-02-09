import * as Knex from 'knex'
import SubGameSession from "../interfaces/sub-game-session";
import {MakeMaybe} from "../generated/graphql";
import User from "../interfaces/user";

type StartSubGameSessionInput = MakeMaybe<Omit<SubGameSession, 'isActive' | 'id'>, 'maxActivePlayers' | 'maxPlayCount' | 'userMustVerifyEpic' | 'onlyAllowSubs'>

export default function SubGameSessionRepository (db: Knex) {
  const repository = {
    startSubGameSession (subGameSession: StartSubGameSessionInput): Promise<SubGameSession> {
      return repository.hasActiveSession(subGameSession.ownerId)
        .then(hasActiveSession => {
          if (hasActiveSession) throw new Error('User already has active session')

          return db('subGameSession')
            .returning('*')
            .insert<SubGameSession[]>({
              ...subGameSession,
              isActive: true
            })
            .then(results => results[0])
          })

    },
    hasActiveSession (ownerId: string): Promise<Boolean> {
      return db('subGameSession').count<{ count: number }[]>('id').where({ ownerId, isActive: true })
        .then(result => {
          if (!result[0]) return false
          return result[0].count > 0
        })
    },
    findActiveSessionByUser(user: User): Promise<SubGameSession | undefined> {
      return db<SubGameSession>('subGameSession').first().where({ ownerId: user.id, isActive: true })
    },
    getQueuedPlayersForSession(session: SubGameSession): Promise<User[]> {
      if (!session.isActive) throw new Error('No queue for inactive sessions')

      return db.select<User[]>('user.*')
        .from('userSubGameSessionQueue')
        .where({ subGameSessionId: session.id })
        .join('user', 'user.id', 'userSubGameSessionQueue.userId')
        .then(results => results)
    }
  }

  return repository
}
