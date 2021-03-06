import { QueryResolvers } from '../../generated/graphql'
import {
  GraphQLAuthenticationError,
  GraphQLForbiddenNotOwnerError,
  GraphQLUserInputError
} from '../../../shared/errors/graphql-errors'
import { fromGlobalId, toGlobalId } from 'graphql-relay'
import { pluck, find, propEq } from 'ramda'
import SubGameSession from '../../../shared/interfaces/models/sub-game-session'
import { TwitchGetFollowedStreamsPayload } from '../../../shared/interfaces/services/twitch.service'

const sessionsByUserId: QueryResolvers['sessionsByUserId'] = async (
  _,
  { input: { userId: globalUserId, first, after } },
  { jwtPayload, config, logger, TwitchService, subGameSessionRepository, loaders }
) => {
  if (jwtPayload === undefined) {
    throw new GraphQLAuthenticationError()
  }

  const verifiedFirst = (first === null || first === undefined) ? 50 : first
  if (verifiedFirst < 0) {
    throw new GraphQLUserInputError({
      resourceType: 'Session',
      argumentName: 'first',
      reason: '"first" argument must be non negative.'
    })
  }
  const verifiedAfter = (after === null) ? undefined : after

  const { id: userId } = fromGlobalId(globalUserId)
  if (jwtPayload.sub !== userId) {
    throw new GraphQLForbiddenNotOwnerError()
  }

  return await loaders.userByIdLoader.load(userId)
    .then(async user => {
      if (user === null) {
        throw new Error(`Could not find user ${userId}`)
      }

      const twitchService = TwitchService(user, config.twitchClientId, config.twitchClientSecret, logger)
      return await twitchService.getFollowedStreams(verifiedAfter, verifiedFirst)
        .then(async (streams) => {
          const userIds = pluck('user_id')(streams.data)
          return await subGameSessionRepository.getLatestSessionForUsers(userIds)
            .then((subGameSessions): [TwitchGetFollowedStreamsPayload, SubGameSession[]] => ([streams, subGameSessions]))
        })
        .then(([streamsPayload, subGameSessions]) => {
          return {
            edges: streamsPayload.data.map((stream) => ({
              node: {
                id: toGlobalId('Session', stream.user_id),
                twitchSession: {
                  gameName: stream.game_name,
                  viewerCount: stream.viewer_count,
                  thumbnailURL: stream.thumbnail_url,
                  user: {
                    id: toGlobalId('User', stream.user_id),
                    username: stream.user_name
                  }
                },
                subGameSession: find(propEq('id', stream.user_id))(subGameSessions)
              },
              cursor: streamsPayload.pagination.cursor
            })),
            pageInfo: {
              hasNextPage: streamsPayload.pagination.cursor !== undefined,
              hasPreviousPage: false,
              startCursor: streamsPayload.pagination.cursor ?? '',
              endCursor: streamsPayload.pagination.cursor ?? ''
            }
          }
        })
    })
}

export default {
  Query: {
    sessionsByUserId
  }
}
