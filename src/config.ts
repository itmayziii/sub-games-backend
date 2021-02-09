interface Config {
  JWTSecretKey: string
  twitchClientSecret: string
  dbHost: string
  dbPassword: string
}

export default function getConfig (): Config {
  if (
    process.env.SGC_JWT_SECRET === undefined ||
    process.env.SGC_TWITCH_CLIENT_SECRET === undefined ||
    process.env.SGC_DB_HOST === undefined ||
    process.env.SGC_DB_PASSWORD === undefined
  ) {
    throw new Error('missing config values')
  }

  return {
    JWTSecretKey: process.env.SGC_JWT_SECRET,
    twitchClientSecret: process.env.SGC_TWITCH_CLIENT_SECRET,
    dbHost: process.env.SGC_DB_HOST,
    dbPassword: process.env.SGC_DB_PASSWORD
  }
}
