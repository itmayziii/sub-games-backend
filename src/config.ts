import Logger from './interfaces/logger'

interface Configuration {
  JWTSecretKey: string
  twitchClientSecret: string
  twitchCallbackURL: string
  dbHost: string
  dbPassword: string
  logLevel: keyof Logger
}

export default function Config (): Configuration {
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

  return {
    JWTSecretKey: process.env.SGC_JWT_SECRET,
    twitchClientSecret: process.env.SGC_TWITCH_CLIENT_SECRET,
    twitchCallbackURL: process.env.SGC_TWITCH_CALLBACK_URL,
    dbHost: process.env.SGC_DB_HOST,
    dbPassword: process.env.SGC_DB_PASSWORD,
    logLevel: process.env.SGC_LOG_LEVEL as keyof Logger ?? 'info'
  }
}
