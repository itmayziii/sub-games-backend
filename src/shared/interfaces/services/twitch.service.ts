// https://dev.twitch.tv/docs/v5#errors
export interface TwitchErrorPayload {
  status: number
  message: string
}

// https://dev.twitch.tv/docs/authentication#refreshing-access-tokens
export interface TwitchRefreshAccessTokenPayload {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string[]
  token_type: string
}

// https://dev.twitch.tv/docs/authentication#validating-requests
export interface TwitchValidateAccessTokenPayload {
  client_id: string
  login: string
  scopes: string[]
  user_id: string
  expires_in: number
}

// https://dev.twitch.tv/docs/api/reference#get-followed-streams
export interface TwitchGetFollowedStreamsPayload {
  data: Array<{
    id: string
    user_id: string
    user_login: string
    user_name: string
    game_id: string
    game_name: string
    type: 'live' | ''
    title: string
    viewer_count: number
    started_at: string
    language: string
    thumbnail_url: string
    tag_ids: string[]
  }>
  pagination: {
    cursor?: string
  }
}

export default interface TwitchService {
  getFollowedStreams: (after?: string, first?: number) => Promise<TwitchGetFollowedStreamsPayload>
  validateAccessToken: (accessToken: string) => Promise<boolean>
  refreshAccessToken: (refreshToken: string) => Promise<{ accessToken: string, refreshToken: string }>
}
