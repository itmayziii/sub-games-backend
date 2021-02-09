import { MutationResolvers, Player, QueryResolvers, User } from '../../generated/graphql'
import SubGameSession from '../../interfaces/sub-game-session'
import { GraphQLContext } from '../../interfaces/graphql'
import { ApolloError, AuthenticationError, ForbiddenError } from 'apollo-server-express'

const startSubGameSession: MutationResolvers['startSubGameSession'] = async (
  _,
  { input: { ownerId, maxPlayCount, userMustVerifyEpic = false, maxActivePlayers = 3, onlyAllowSubs = true } },
  { subGameSessionRepository, user }
) => {
  if (user === undefined) {
    throw new AuthenticationError('UNAUTHENTICATED')
  }

  if (user.id !== ownerId) {
    throw new ForbiddenError('FORBIDDEN')
  }

  return await subGameSessionRepository.startSession({
    ownerId,
    maxPlayCount,
    maxActivePlayers,
    userMustVerifyEpic,
    onlyAllowSubs
  })
    .then(subGameSession => ({ subGameSession }))
}

const getSubGameSession: QueryResolvers['getSubGameSession'] = async (
  _,
  { input: { username } },
  { subGameSessionRepository, user, userRepository }
) => {
  if (user === undefined) {
    throw new AuthenticationError('UNAUTHENTICATED')
  }

  return await userRepository.findByUsername(username)
    .then(async matchedUser => {
      if (matchedUser === undefined) {
        throw new ApolloError('User is not signed up for Sub Games Companion')
      }

      return await subGameSessionRepository.findActiveSessionByUser(matchedUser)
        .then(subGameSession => ({ subGameSession }))
    })
}

async function owner (subGameSession: SubGameSession, _: unknown, { userRepository }: GraphQLContext): Promise<User> {
  return await userRepository.find(subGameSession.ownerId)
    .then(owner => {
      if (owner === undefined) {
        throw new ApolloError('Owner was not found on sub game')
      }

      return owner
    })
}

async function queuedPlayers (subGameSession: SubGameSession, _: unknown, { subGameSessionRepository }: GraphQLContext): Promise<Player[]> {
  return await subGameSessionRepository.getQueuedPlayersForSession(subGameSession)
    .then(users => users.map(user => ({
      ...user,
      playCount: 2,
      allTimePlayCount: 4
    })))
}

async function alreadyPlayedUsers (subGameSession: SubGameSession, _: unknown, { subGameSessionRepository }: GraphQLContext): Promise<Player[]> {
  return await subGameSessionRepository.getPlayerHistoryForSession(subGameSession)
    .then(users => users.map(user => ({
      ...user,
      playCount: 2,
      allTimePlayCount: 4
    })))
}

async function activePlayers (subGameSession: SubGameSession, _: unknown, { subGameSessionRepository }: GraphQLContext): Promise<Player[]> {
  return await subGameSessionRepository.getActivePlayersForSession(subGameSession)
    .then(users => users.map(user => ({
      ...user,
      playCount: 2,
      allTimePlayCount: 4
    })))
}

const joinSubGameSessionQueue: MutationResolvers['joinSubGameSessionQueue'] = async (
  _,
  { input: { userId, sessionId } },
  { subGameSessionRepository, user, userRepository }
) => {
  if (user === undefined) {
    throw new AuthenticationError('UNAUTHENTICATED')
  }

  return await Promise.all([userRepository.find(userId), subGameSessionRepository.find(sessionId)])
    .then(async ([userToJoin, sessionToJoin]) => {
      if (userToJoin === undefined) {
        throw new ApolloError('User does not exist')
      }

      if (sessionToJoin === undefined) {
        throw new ApolloError('Session does not exist')
      }

      if (userToJoin.id !== user.id && user.id !== sessionToJoin.ownerId) {
        throw new ForbiddenError('FORBIDDEN')
      }

      return await subGameSessionRepository.joinSession(userToJoin, sessionToJoin)
        .then(() => ({ subGameSession: sessionToJoin }))
    })
}

export default {
  Query: {
    getSubGameSession
  },
  Mutation: {
    startSubGameSession,
    joinSubGameSessionQueue
  },
  SubGameSession: {
    owner,
    queuedPlayers,
    alreadyPlayedUsers,
    activePlayers
  }
}
