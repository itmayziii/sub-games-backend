import {MutationResolvers, Player, QueryResolvers, User} from "../../generated/graphql";
import SubGameSession from "../../interfaces/sub-game-session";
import {GraphQLContext} from "../../interfaces/graphql";
import {ApolloError, AuthenticationError, ForbiddenError} from 'apollo-server-express'

const startSubGameSession: MutationResolvers['startSubGameSession'] = (
  _,
  { input: { ownerId, maxPlayCount, userMustVerifyEpic = false, maxActivePlayers = 3, onlyAllowSubs = true } },
  { subGameSessionRepository, user }
  ) => {
  if (!user) {
    throw new AuthenticationError('UNAUTHENTICATED')
  }

  if (user.id !== ownerId) {
    throw new ForbiddenError('FORBIDDEN')
  }

  return subGameSessionRepository.startSubGameSession({
    ownerId,
    maxPlayCount,
    maxActivePlayers,
    userMustVerifyEpic,
    onlyAllowSubs
  })
    .then(subGameSession => ({ subGameSession }))
}

const getSubGameSession: QueryResolvers['getSubGameSession'] = (
  _,
  { input: { username } },
  { subGameSessionRepository, user, userRepository }
) => {
  if (!user) {
    throw new AuthenticationError('UNAUTHENTICATED')
  }

  return userRepository.findByUsername(username)
    .then(matchedUser => {
      if (!matchedUser) {
        throw new ApolloError('User is not signed up for Sub Games Companion')
      }

      return subGameSessionRepository.findActiveSessionByUser(matchedUser)
        .then(subGameSession => ({ subGameSession }))
    })
}

function owner (subGameSession: SubGameSession, {}: any, { userRepository }: GraphQLContext): Promise<User> {
  return userRepository.find(subGameSession.ownerId)
    .then(owner => {
      if (!owner) {
        throw new ApolloError('Owner was not found on sub game')
      }

      return owner
    })
}

function queuedPlayers (subGameSession: SubGameSession, {}: any, { subGameSessionRepository }: GraphQLContext): Promise<Player[]> {
  return subGameSessionRepository.getQueuedPlayersForSession(subGameSession)
    .then(users => {
      console.log('users', users)
      return users.map(user => ({
        ...user,
        playCount: 2,
        allTimePlayCount: 4
      }))
    })
}

function alreadyPlayedUsers () {

}

function activePlayers () {

}

export default {
  Query: {
    getSubGameSession
  },
  Mutation: {
    startSubGameSession
  },
  SubGameSession: {
    owner,
    queuedPlayers,
    alreadyPlayedUsers,
    activePlayers
  }
}
