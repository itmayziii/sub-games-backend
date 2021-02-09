// TODO replace with ENV var

export default function getConfig () {
  if (
    !process.env.SGC_JWT_SECRET ||
    !process.env.SGC_TWITCH_CLIENT_SECRET ||
    !process.env.SGC_DB_HOST ||
    !process.env.SGC_DB_PASSWORD
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
