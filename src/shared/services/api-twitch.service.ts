import User from '../interfaces/models/user'
import LoggerInterface from '../interfaces/logger'
import fetch from 'node-fetch'
import TwitchService, {
  TwitchErrorPayload, TwitchGetFollowedStreamsPayload,
  TwitchRefreshAccessTokenPayload,
  TwitchValidateAccessTokenPayload
} from '../interfaces/services/twitch.service'

export default function APITwitchService (user: User, clientId: string, clientSecret: string, logger: LoggerInterface): TwitchService {
  return {
    async getFollowedStreams (after = undefined, first = 100) {
      logger.debug(`APITwitchService.getFollowedStreams was called for user - ${user.id}.`)
      if (user.twitchAccessToken === null) throw new Error('Twitch access token is required to make Twitch API calls.')

      const afterParam = after === undefined ? '' : `&after=${after}`
      const firstParam = first === undefined ? '' : `&first=${first}`
      return await fetch(`https://api.twitch.tv/helix/streams/followed?user_id=${user.id}${afterParam}${firstParam}`, {
        headers: {
          authorization: `Bearer ${user.twitchAccessToken}`,
          'client-id': clientId
        }
      })
        .then(async (response): Promise<[boolean, TwitchErrorPayload | TwitchGetFollowedStreamsPayload]> => {
          return await response.json()
            .then(data => [response.ok, data])
        })
        .then(([isOkay, data]) => {
          if (isValidResponse<TwitchGetFollowedStreamsPayload>(data, isOkay)) {
            logger.debug(`APITwitchService.getFollowedStreams successfully retrieved followed streams "${user.id}."`)
            return data
          }

          logger.error(`APITwitchService.getFollowedStreams received a bad response from Twitch for user "${user.id}" with message "${data.message}"`)
          throw new Error('Failed to get followed streams from Twitch')
        })
    },
    async validateAccessToken (accessToken) {
      logger.debug(`APITwitchService.validateAccessToken was called for user "${user.id}."`)
      return await fetch('https://id.twitch.tv/oauth2/validate', {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })
        .then(async (response): Promise<[boolean, TwitchErrorPayload | TwitchValidateAccessTokenPayload]> => {
          return await response.json()
            .then(data => ([response.ok, data]))
        })
        .then(([isOkay, data]) => {
          if (isValidResponse<TwitchValidateAccessTokenPayload>(data, isOkay)) {
            logger.debug(`APITwitchService.validateAccessToken successfully validated Twitch access token for user "${user.id}."`)
            return true
          }

          // Info log here because access tokens are expected to become invalid.
          logger.info(`APITwitchService.validateAccessToken failed to validate Twitch access token for user "${user.id}" with message "${data.message}."`)
          return false
        })
    },
    async refreshAccessToken (refreshToken) {
      logger.debug(`APITwitchService.refreshAccessToken was called for user "${user.id}."`)
      return await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret
        })
      })
        .then(async (response): Promise<[boolean, TwitchErrorPayload | TwitchRefreshAccessTokenPayload]> => {
          return await response.json()
            .then(data => ([response.ok, data]))
        })
        .then(([isOkay, data]) => {
          if (isValidResponse<TwitchRefreshAccessTokenPayload>(data, isOkay)) {
            logger.info(`APITwitchService.refreshAccessToken successfully refreshed access token for user "${user.id}"`)
            return { accessToken: data.access_token, refreshToken: data.refresh_token }
          }

          logger.error(`APITwitchService.refreshAccessToken failed to refresh Twitch access token for user "${user.id}" with message "${data.message}."`)
          throw new Error(`Failed to refresh Twitch access token with message "${data.message}"`)
        }
        )
    }
  }
}

function isValidResponse<ResponsePayload> (data: TwitchErrorPayload | ResponsePayload, isOkay: boolean): data is ResponsePayload {
  return isOkay
}
