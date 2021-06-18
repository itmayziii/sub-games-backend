import { Router } from 'express'
import getPassport from '../../shared/passport'
import twitchCallbackHandler from '../handlers/twitch-callback.handler'
import Knex from 'knex'
import UserRepository from '../../shared/interfaces/repositories/user.repository'
import Configuration from '../../shared/interfaces/config'
import loginHandler from '../handlers/login.handler'

export default function getV1Router (db: Knex, config: Configuration, userRepository: UserRepository): Router {
  const v1Router = Router()
  const passport = getPassport(db, config, userRepository)
  const oAuth2TwitchAuth = passport.authenticate('oauth2-twitch', { session: false })

  v1Router.get('/login', loginHandler)
  v1Router.get('/login/oauth2/twitch', oAuth2TwitchAuth)
  v1Router.get('/oauth2/twitch/callback', oAuth2TwitchAuth, twitchCallbackHandler)

  return v1Router
}
