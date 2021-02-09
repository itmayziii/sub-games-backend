export default interface User {
  id: string
  username: string
  refreshToken?: string
  twitchAccessToken?: string
  twitchRefreshToken?: string
  twitchExpires?: number
  twitchIat?: number
}
