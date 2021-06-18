export interface JWTPayload {
  sub: string
  iss: string
  aud: string

  // Custom claims - We namespace these to prevent collisions - https://auth0.com/docs/tokens/create-namespaced-custom-claims
  'https://sub-games.com/permissions': string[]
  'https://sub-games.com/username': string
}
