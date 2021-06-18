import Logger from './interfaces/logger'
import Configuration from './interfaces/config'

let config: Configuration
export default function Config (): Configuration {
  if (config !== undefined) return config
  if (
    process.env.SGC_JWT_SECRET === undefined ||
    process.env.SGC_TWITCH_CLIENT_ID === undefined ||
    process.env.SGC_TWITCH_CLIENT_SECRET === undefined ||
    process.env.SGC_TWITCH_CALLBACK_URL === undefined ||
    process.env.SGC_IRC_BOT_ACCESS_TOKEN === undefined ||
    process.env.SGC_IRC_BOT_REFRESH_TOKEN === undefined ||
    process.env.SGC_IRC_BOT_NAME === undefined ||
    process.env.SGC_DB_HOST === undefined ||
    process.env.SGC_DB_PASSWORD === undefined ||
    (process.env.SGC_LOG_LEVEL !== undefined && !['critical', 'error', 'info', 'debug'].includes(process.env.SGC_LOG_LEVEL)) ||
    process.env.SGC_WEB_APP_URL === undefined
  ) {
    throw new Error('invalid config values')
  }

  config = {
    JWTSecretKey: process.env.SGC_JWT_SECRET,
    twitchClientId: process.env.SGC_TWITCH_CLIENT_ID,
    twitchClientSecret: process.env.SGC_TWITCH_CLIENT_SECRET,
    twitchCallbackURL: process.env.SGC_TWITCH_CALLBACK_URL,
    twitchIRCBotAccessToken: process.env.SGC_IRC_BOT_ACCESS_TOKEN,
    twitchIRCBotRefreshToken: process.env.SGC_IRC_BOT_REFRESH_TOKEN,
    twitchIRCBotName: process.env.SGC_IRC_BOT_NAME,
    dbHost: process.env.SGC_DB_HOST,
    dbUser: 'subGamesCompanionApp',
    dbPassword: process.env.SGC_DB_PASSWORD,
    dbDatabase: 'subGamesCompanion',
    logLevel: process.env.SGC_LOG_LEVEL as keyof Logger ?? 'info',
    webAppURL: process.env.SGC_WEB_APP_URL
  }
  return config
}
