export default interface User {
  id: string
  username: string
  refreshToken: string | null
  twitchAccessToken: string | null
  twitchRefreshToken: string | null
  lastTwitchValidation: Date | null
}
