import passport from 'passport'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as OAuth2Strategy } from 'passport-oauth2'
import fetch from 'node-fetch'
import { Request } from 'express'
import * as Knex from 'knex'
import UserRepository from './interfaces/repositories/user.repository'
import Configuration from './interfaces/config'

let cachedPassport: passport.PassportStatic
export default function getPassport (db: Knex, config: Configuration, userRepository: UserRepository): passport.PassportStatic {
  if (cachedPassport !== undefined) return cachedPassport
  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtCookieExtractor
    ]),
    secretOrKey: config.JWTSecretKey,
    issuer: 'sub-games-companion.com',
    audience: 'sub-games-companion.com'
  }, (payload, done) => {
    userRepository.find(payload.sub)
      .then(user => {
        if (user === undefined) {
          return done(null, false)
        }

        done(null, user)
      })
      .catch(error => done(error, false))
  }))

  passport.use('oauth2-twitch', new OAuth2Strategy({
    authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
    tokenURL: 'https://id.twitch.tv/oauth2/token',
    clientID: config.twitchClientId,
    clientSecret: config.twitchClientSecret,
    callbackURL: config.twitchCallbackURL,
    // https://dev.twitch.tv/docs/authentication#scopes
    scope: ['moderation:read', 'channel:read:subscriptions', 'openid', 'user:read:follows']
  }, (accessToken: string, refreshToken: string, profile: {}, cb: Function) => {
    const userClaims = JSON.stringify({ id_token: { preferred_username: null } })
    fetch(`https://id.twitch.tv/oauth2/userinfo?claims=${userClaims}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(async res => await res.json())
      .then(async profile => {
        return await userRepository.createOrUpdate(profile.sub, {
          id: profile.sub,
          username: profile.preferred_username,
          twitchAccessToken: accessToken,
          twitchRefreshToken: refreshToken,
          lastTwitchValidation: db.fn.now()
        })
      })
      .then(user => cb(null, user))
      .catch(err => cb(err, false))
  }))

  cachedPassport = passport
  return cachedPassport
}

function jwtCookieExtractor (req: Request): string | null {
  if (req.cookies.accessToken === undefined) {
    return null
  }

  return req.cookies.accessToken
}
