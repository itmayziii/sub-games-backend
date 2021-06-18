import tmi from 'tmi.js'
import Configuration from '../shared/interfaces/config'
import Logger from '../shared/interfaces/logger'

const ircClients: { [key: string]: tmi.Client } = {}
export default ircClients

export function connect (channel: string, config: Configuration, logger: Logger): void {
  let client = ircClients[channel]
  if (client !== undefined && ['OPEN', 'CONNECTING'].includes(client.readyState())) {
    return
  }

  if (client === undefined) {
    client = tmi.Client({
      options: { debug: process.env.NODE_ENV !== 'production' },
      identity: {
        username: config.twitchIRCBotName,
        password: `oauth:${config.twitchIRCBotAccessToken}`
      },
      channels: [channel],
      logger: {
        info (message) {
          logger.info(message)
        },
        warn (message) {
          logger.info(message)
        },
        error (message) {
          logger.error(message)
        }
      }
    })
  }

  connectClient(client, logger)
    .catch(logger.error)
}

async function connectClient (client: tmi.Client, logger: Logger): Promise<void> {
  client.removeAllListeners() // Remove all old listeners, this is a precaution to make sure we don't have duplicate listeners.
  return await client.connect()
    .then(() => {
      client.on('message', (channel, tags, message, self) => {
        console.log('channel', channel)
        console.log('tags', tags)
        console.log('message', message)
        if (self) return // These are messages from this chat bot.

        const joinCommand = 'join' // TODO we should make this configurable by the streamer.
      })
    })
}
