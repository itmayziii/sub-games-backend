/**
 * These errors are meant to be thrown from a resolver function as they are returned to the user in the "errors"
 * field in GraphQL.
 * https://www.apollographql.com/docs/apollo-server/data/errors/
 * https://spec.graphql.org/June2018/#sec-Errors
 */

import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express'

/**
 * When a user is missing or has invalid credentials.
 */
export class GraphQLAuthenticationError extends AuthenticationError {
  constructor () {
    super('You must provide valid authentication credentials either through the "Authentication" header as a bearer token or as a cookie. i.e. Header - Authorization: Bearer someToken, Cookie - accessToken: someToken')
  }
}

/**
 * When a user does not own a resource and therefore may not take action on it.
 */
export class GraphQLForbiddenNotOwnerError extends ForbiddenError {
  constructor () {
    super('Only the owner may perform this action.')
  }
}

/**
 * When a user is not signed up for this application.
 */
export class GraphQLNotSignedUpError extends UserInputError {
  constructor (userId: string, argumentName: 'username' | 'id') {
    super(`Invalid argument value - user ${userId} - is not signed up for Sub Games Companion`, { argumentName })
  }
}

/**
 * When a user requests a resource that we can not find in our system. This is mostly for mutations as queries generally
 * just return null when we can not find data.
 */
export class GraphQLUserInputError extends UserInputError {
  constructor (invalidArgument: { resourceType: string, resourceId?: string, argumentName: string, reason: string }) {
    super('Invalid argument value(s)', { invalidArgument })
  }
}
