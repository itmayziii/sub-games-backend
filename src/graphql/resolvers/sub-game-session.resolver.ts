import { MutationResolvers, Player, QueryResolvers, User } from '../../generated/graphql'
import SubGameSession from '../../interfaces/models/sub-game-session'
import { GraphQLContext } from '../../interfaces/graphql'
import { ApolloError, ForbiddenError } from 'apollo-server-express'
import { fromGlobalId, toGlobalId } from 'graphql-relay'
import {
  GraphQLAuthenticationError,
  GraphQLForbiddenNotOwnerError,
  GraphQLNotSignedUpError,
  GraphQLUserInputError
} from '../../errors/graphql-errors'

const startSubGameSession: MutationResolvers['startSubGameSession'] = async (
  _,
  { input: { ownerId, maxPlayCount, userMustVerifyEpic = false, maxActivePlayers = 3, isSubOnly = true } },
  { subGameSessionRepository, user }
) => {
  if (user === undefined) {
    throw new GraphQLAuthenticationError()
  }

  if (user.id !== ownerId) {
    throw new GraphQLForbiddenNotOwnerError()
  }

  return await subGameSessionRepository.startSession({
    ownerId,
    maxPlayCount: maxPlayCount === undefined ? null : maxPlayCount,
    maxActivePlayers,
    userMustVerifyEpic,
    isSubOnly
  })
    .then(subGameSession => ({ subGameSession: { ...subGameSession, id: toGlobalId('SubGameSession', subGameSession.id.toString()) } }))
}

const activeSubGameSessionByUsername: QueryResolvers['activeSubGameSessionByUsername'] = async (
  _,
  { input: { username } },
  { subGameSessionRepository, user, userRepository }
) => {
  if (user === undefined) {
    throw new GraphQLAuthenticationError()
  }

  return await userRepository.findByUsername(username)
    .then(async matchedUser => {
      if (matchedUser === undefined) {
        throw new GraphQLNotSignedUpError(username, 'username')
      }

      return await subGameSessionRepository.findActiveSessionByUser(matchedUser)
        .then(subGameSession => {
          if (subGameSession === undefined) return { subGameSession: null }
          return { subGameSession: { ...subGameSession, id: toGlobalId('SubGameSession', subGameSession.id.toString()) } }
        })
    })
}

const activeSubGameSessionByUserId: QueryResolvers['activeSubGameSessionByUserId'] = async (
  _,
  { input: { id: globalId } },
  { subGameSessionRepository, user, userRepository }
) => {
  if (user === undefined) {
    throw new GraphQLAuthenticationError()
  }

  const { id } = fromGlobalId(globalId)
  return await userRepository.find(id)
    .then(async matchedUser => {
      if (matchedUser === undefined) {
        throw new GraphQLNotSignedUpError(globalId, 'id')
      }

      return await subGameSessionRepository.findActiveSessionByUser(matchedUser)
        .then(subGameSession => {
          if (subGameSession === undefined) return { subGameSession: null }
          return { subGameSession: { ...subGameSession, id: toGlobalId('SubGameSession', subGameSession.id.toString()) } }
        })
    })
}

const subGameSessionById: QueryResolvers['subGameSessionById'] = async (
  _,
  { input: { id: globalId } },
  { subGameSessionRepository, user }
) => {
  if (user === undefined) {
    throw new GraphQLAuthenticationError()
  }

  const { id } = fromGlobalId(globalId)
  return await subGameSessionRepository.find(parseInt(id))
    .then(subGameSession => {
      if (subGameSession === undefined) return { subGameSession: null }
      return {
        subGameSession: {
          ...subGameSession,
          id: toGlobalId('SubGameSession', subGameSession.id.toString()),
          __typename: 'SubGameSession'
        }
      }
    })
}

async function owner (subGameSession: SubGameSession, _: unknown, { userRepository }: GraphQLContext): Promise<User> {
  return await userRepository.find(subGameSession.ownerId)
    .then(owner => {
      if (owner === undefined) {
        throw new ApolloError('Owner was not found on sub game')
      }

      return { ...owner, id: toGlobalId('User', owner.id) }
    })
}

async function queuedPlayers (subGameSession: SubGameSession, _: unknown, { subGameSessionRepository }: GraphQLContext): Promise<Player[]> {
  const { id } = fromGlobalId(subGameSession.id.toString())
  return await subGameSessionRepository.getQueuedPlayersForSession({ ...subGameSession, id: parseInt(id) })
    .then(users => users.map(user => ({
      ...user,
      id: toGlobalId('QueuedPlayer', user.id),
      playCount: 2,
      allTimePlayCount: 4
    })))
}

async function alreadyPlayedUsers (subGameSession: SubGameSession, _: unknown, { subGameSessionRepository }: GraphQLContext): Promise<Player[]> {
  const { id } = fromGlobalId(subGameSession.id.toString())
  return await subGameSessionRepository.getPlayerHistoryForSession({ ...subGameSession, id: parseInt(id) })
    .then(users => users.map(user => ({
      ...user,
      id: toGlobalId('Player', user.id),
      playCount: 2,
      allTimePlayCount: 4
    })))
}

async function activePlayers (subGameSession: SubGameSession, _: unknown, { subGameSessionRepository }: GraphQLContext): Promise<Player[]> {
  const { id } = fromGlobalId(subGameSession.id.toString())
  return await subGameSessionRepository.getActivePlayersForSession({ ...subGameSession, id: parseInt(id) })
    .then(users => users.map(user => ({
      ...user,
      id: toGlobalId('Player', user.id),
      playCount: 2,
      allTimePlayCount: 4
    })))
}

const joinSubGameSessionQueue: MutationResolvers['joinSubGameSessionQueue'] = async (
  _,
  { input: { userId: globalUserId, sessionId: globalSessionId } },
  { subGameSessionRepository, user, userRepository }
) => {
  if (user === undefined) {
    throw new GraphQLAuthenticationError()
  }

  const { id: userId } = fromGlobalId(globalUserId)
  const { id: sessionId } = fromGlobalId(globalSessionId)
  return await Promise.all([userRepository.find(userId), subGameSessionRepository.find(parseInt(sessionId, 10))])
    .then(async ([userToJoin, sessionToJoin]) => {
      if (userToJoin === undefined) {
        throw new GraphQLUserInputError({
          resourceType: 'Player',
          resourceId: userId,
          argumentName: 'userId',
          reason: `No Player found with ID ${userId}`
        })
      }
      if (sessionToJoin === undefined) {
        throw new GraphQLUserInputError({
          resourceType: 'SubGameSession',
          resourceId: sessionId,
          argumentName: 'sessionId',
          reason: `No SubGameSession found with ID ${sessionId}`
        })
      }

      if (userToJoin.id !== user.id || user.id === sessionToJoin.ownerId) {
        throw new ForbiddenError('FORBIDDEN')
      }

      return await subGameSessionRepository.joinSession(userToJoin, sessionToJoin)
        .then(() => ({ subGameSession: { ...sessionToJoin, id: toGlobalId('SubGameSession', sessionToJoin.id.toString()) } }))
    })
}

const movePlayerQueueOrder: MutationResolvers['movePlayerQueueOrder'] = async (
  _,
  { input: { userId: globalUserId, order, sessionId: globalSessionId } },
  { user, subGameSessionRepository, userRepository }
) => {
  if (user === undefined) {
    throw new GraphQLAuthenticationError()
  }

  const { id: userId } = fromGlobalId(globalUserId)
  const { id: sessionId } = fromGlobalId(globalSessionId)
  return await Promise.all([userRepository.find(userId), subGameSessionRepository.find(parseInt(sessionId, 10))])
    .then(async ([userToMove, sessionToJoin]) => {
      if (userToMove === undefined) {
        throw new GraphQLUserInputError({
          resourceType: 'Player',
          resourceId: userId,
          argumentName: 'userId',
          reason: `No Player found with ID ${userId}`
        })
      }
      if (sessionToJoin === undefined) {
        throw new GraphQLUserInputError({
          resourceType: 'SubGameSession',
          resourceId: sessionId,
          argumentName: 'sessionId',
          reason: `No SubGameSession found with ID ${sessionId}`
        })
      }

      if (user.id !== sessionToJoin.ownerId) { // TODO check if user is mod or owner on twitch
        throw new GraphQLForbiddenNotOwnerError()
      }

      return await subGameSessionRepository.moveUserInSessionQueue(sessionToJoin, userToMove, order)
        .then(() => ({ subGameSession: { ...sessionToJoin, id: toGlobalId('SubGameSession', sessionToJoin.id.toString()) } }))
    })
}

export default {
  Query: {
    activeSubGameSessionByUsername,
    subGameSessionById,
    activeSubGameSessionByUserId
  },
  Mutation: {
    startSubGameSession,
    joinSubGameSessionQueue,
    movePlayerQueueOrder
  },
  SubGameSession: {
    owner,
    queuedPlayers,
    alreadyPlayedUsers,
    activePlayers
  }
}
