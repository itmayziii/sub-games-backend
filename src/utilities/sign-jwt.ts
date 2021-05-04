import jwt from 'jsonwebtoken'
import User from '../interfaces/models/user'
import { toGlobalId } from 'graphql-relay'

export function signJWT (user: User, jwtSecretKey: string, isStreamerApproved: boolean): string {
  let roles: string[] = []
  if (isStreamerApproved) {
    roles = [...roles, 'game-creator']
  }

  return jwt.sign({
    sub: toGlobalId('User', user.id),
    iss: 'https://sub-games.com',
    aud: 'https://sub-games.com',
    // Custom claims - We namespace these to prevent collisions - https://auth0.com/docs/tokens/create-namespaced-custom-claims
    'https://sub-games.com/roles': roles,
    'https://sub-games.com/username': user.username
  }, jwtSecretKey, { algorithm: 'HS256', expiresIn: 60 * 180 })
}
