import passport from 'passport'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import {
  Metadata,
  StateStore as Oauth2StateStore,
  StateStoreStoreCallback, StateStoreVerifyCallback,
  Strategy as OAuth2Strategy
} from 'passport-oauth2'
import fetch from 'node-fetch'
import { Request } from 'express'
import * as Knex from 'knex'
import UserRepository from './interfaces/repositories/user.repository'
import Configuration from './interfaces/config'
import { fromGlobalId, toGlobalId } from 'graphql-relay'
import crypto from 'crypto'

function StateStore (db: Knex): Oauth2StateStore {
  return {
    store (request: Request, metaOrCallback: StateStoreStoreCallback | Metadata, callback?: StateStoreStoreCallback) {
      const redirectUrlQuery = request.query.redirect_url
      let redirectURL = 'http://localhost:3000/sessions'
      if (typeof redirectUrlQuery === 'string') {
        redirectURL = redirectUrlQuery
      }
      const randomId = crypto.randomBytes(16).toString('hex')
      const state = toGlobalId(randomId, redirectURL)

      db('oauthState').insert({ id: state })
        .then(() => {
          if (typeof metaOrCallback === 'function') {
            metaOrCallback(null, state)
            return
          }

          // @ts-expect-error - error is not nullable which is wrong
          callback(null, state)
        })
        .catch((error) => {
          if (typeof metaOrCallback === 'function') {
            metaOrCallback(error, null)
            return
          }

          // @ts-expect-error - error is not nullable which is wrong
          callback(error, state)
        })
    },
    verify (request: Request, state: string, metaOrCallback: StateStoreVerifyCallback | Metadata, callback?: StateStoreVerifyCallback) {
      db('oauthState').first().where({ id: state })
        .then(async (oauthState) => {
          if (oauthState === undefined || oauthState === null) {
            return null
          }

          return await db('oauthState').delete().where({ id: state })
            .then(() => oauthState)
        })
        .then((oauthState) => {
          const doesStateMatch = oauthState?.id === state
          if (typeof metaOrCallback === 'function') {
            // @ts-expect-error - error is not nullable which is wrong
            metaOrCallback(null, doesStateMatch, state)
            return
          }

          // @ts-expect-error - error is not nullable which is wrong
          callback(null, doesStateMatch, state)
        })
        .catch((error) => {
          if (typeof metaOrCallback === 'function') {
            metaOrCallback(error, false, state)
            return
          }

          // @ts-expect-error - error is not nullable which is wrong
          callback(error, false, state)
        })
    }
  }
}

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
    const { id: userId } = fromGlobalId(payload.sub)
    userRepository.find(userId)
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
    scope: ['moderation:read', 'channel:read:subscriptions', 'openid', 'user:read:follows'],
    state: true,
    store: StateStore(db)
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
