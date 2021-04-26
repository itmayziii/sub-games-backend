import Logger from './logger'

export default interface Configuration {
  JWTSecretKey: string
  twitchClientId: string
  twitchClientSecret: string
  twitchCallbackURL: string
  dbHost: string
  dbUser: string
  dbPassword: string
  dbDatabase: string
  logLevel: keyof Logger
}
