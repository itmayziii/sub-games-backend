import { createLogger, format, transports } from 'winston'
import LoggerInterface from './interfaces/logger'

const gcpFormat = format((info) => {
  // https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
  const levelToGCPSeverity = {
    debug: 'DEBUG',
    info: 'INFO',
    error: 'ERROR',
    critical: 'CRITICAL'
  }

  info.severity = levelToGCPSeverity[info.level as keyof LoggerInterface]

  return info
})

export default function Logger (level: keyof LoggerInterface, silent = false): LoggerInterface {
  // Logging to the console because it is the infrastructures job to capture these logs and process them.
  const consoleTransport = new transports.Console()
  return createLogger({
    level,
    levels: {
      critical: 0,
      error: 1,
      info: 2,
      debug: 3
    },
    transports: [
      consoleTransport
    ],
    exceptionHandlers: [
      consoleTransport
    ],
    format: format.combine(
      gcpFormat(),
      format.json()
    ),
    exitOnError: false,
    silent
  }) as unknown as LoggerInterface // Winston does not provide a generic for custom log levels so we are just casting it.
}
