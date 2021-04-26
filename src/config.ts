import Logger from './interfaces/logger'
import Configuration from './interfaces/config'

let config: Configuration
export default function Config (): Configuration {
  if (config !== undefined) return config
  if (
    process.env.SGC_JWT_SECRET === undefined ||
    process.env.SGC_TWITCH_CLIENT_SECRET === undefined ||
    process.env.SGC_TWITCH_CALLBACK_URL === undefined ||
    process.env.SGC_DB_HOST === undefined ||
    process.env.SGC_DB_PASSWORD === undefined ||
    (process.env.SGC_LOG_LEVEL !== undefined && !['critical', 'error', 'info', 'debug'].includes(process.env.SGC_LOG_LEVEL))
  ) {
    throw new Error('invalid config values')
  }

  config = {
    JWTSecretKey: process.env.SGC_JWT_SECRET,
    twitchClientId: '22jvgu8f0zdvnmo44ihw9frcaolxgc',
    twitchClientSecret: process.env.SGC_TWITCH_CLIENT_SECRET,
    twitchCallbackURL: process.env.SGC_TWITCH_CALLBACK_URL,
    dbHost: process.env.SGC_DB_HOST,
    dbUser: 'subGamesCompanionApp',
    dbPassword: process.env.SGC_DB_PASSWORD,
    dbDatabase: 'subGamesCompanion',
    logLevel: process.env.SGC_LOG_LEVEL as keyof Logger ?? 'info'
  }
  return config
}
