import jwt from 'jsonwebtoken'
import { JWTPayload } from '../interfaces/jwt'

export function signJWT (userId: string, username: string, jwtSecretKey: string, isStreamerApproved: boolean): string {
  let permissions: string[] = []
  if (isStreamerApproved) {
    permissions = [...permissions, 'create-session']
  }

  const payload: JWTPayload = {
    sub: userId,
    iss: 'https://sub-games.com',
    aud: 'https://sub-games.com',
    // Custom claims - We namespace these to prevent collisions - https://auth0.com/docs/tokens/create-namespaced-custom-claims
    'https://sub-games.com/permissions': permissions,
    'https://sub-games.com/username': username
  }

  return jwt.sign(payload, jwtSecretKey, { algorithm: 'HS256', expiresIn: 60 * 180 })
}
