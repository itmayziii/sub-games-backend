import { Router } from 'express'
import getPassport from '../passport'
import twitchCallbackHandler from '../handlers/twitch-callback.handler'
import Knex from 'knex'
import UserRepository from '../interfaces/repositories/user.repository'
import Configuration from '../interfaces/config'

export default function getV1Router (db: Knex, config: Configuration, userRepository: UserRepository): Router {
  const v1Router = Router()
  const passport = getPassport(db, config, userRepository)

  const oAuth2TwitchAuth = passport.authenticate('oauth2-twitch', { session: false })
  const JWTAuth = passport.authenticate('jwt', {
    failureRedirect: '/v1/login/oauth2/twitch',
    successRedirect: 'http://localhost:4000/graphql', // TODO replace this with web app URL
    session: false
  })

  v1Router.get('/login', JWTAuth)
  v1Router.get('/login/oauth2/twitch', oAuth2TwitchAuth)
  v1Router.get('/oauth2/twitch/callback', oAuth2TwitchAuth, twitchCallbackHandler)

  return v1Router
}
