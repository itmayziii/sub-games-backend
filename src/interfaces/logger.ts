import { LeveledLogMethod } from 'winston'

/**
 * Attempting to standardize log levels.
 */
export default interface Logger {
  /**
   * This should wake somebody up when they occur.
   *
   * Examples:
   * - Failing to connect to the database.
   * - Getting a bad response from an API from which we have no backup for (like cached results).
   */
  critical: LeveledLogMethod
  /**
   * This should not necessarily wake somebody up but should be investigated.
   *
   * Examples:
   * - Getting a bad response from an API for which we have a back method of handling the exception.
   * - Failing to save to cache.
   */
  error: LeveledLogMethod
  /**
   * Interesting events.
   *
   * Examples:
   * - User logging in.
   * - SQL logs.
   * - Validation failing.
   * - Deprecated API called.
   */
  info: LeveledLogMethod
  /**
   * Detailed debug information.
   *
   * Examples:
   * - Function was called.
   * - Timing of events such as how long a function call took.
   */
  debug: LeveledLogMethod
}
