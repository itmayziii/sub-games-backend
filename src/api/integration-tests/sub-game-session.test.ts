import DB from '../../shared/database/database'
import dotenv from 'dotenv'
import path from 'path'
import { createTestClient } from 'apollo-server-testing'
import makeGraphQLServer from '../graphql-server'
import { loadTypeDefs } from '../graphql/type-defs'
import makeWebServer from '../web-server'
import { gql } from 'apollo-server-express'
import { DocumentNode } from 'graphql'
import testingContext from './context'
import { Request, Response } from 'express'
import KnexUserRepository from '../../shared/repositories/knex-user.repository'
import KnexSubGameSessionRepository from '../../shared/repositories/knex-sub-game-session.repository'
import WinstonLogger from '../../shared/winston-logger'
import DataLoader from 'dataloader'
import UserByIdLoader from '../../shared/loaders/user-by-id.loader'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })
const logger = WinstonLogger('error', true)
const db = DB(logger)
const app = makeWebServer(db)

let typeDefs: DocumentNode
beforeAll(async (): Promise<void> => {
  return await loadTypeDefs()
    .then(loadedTypeDefs => {
      typeDefs = loadedTypeDefs
    })
})

beforeEach(async (): Promise<[string[]]> => {
  return await db.seed.run({
    directory: path.resolve(__dirname, '../database/seeds')
  })
})

afterAll(async (): Promise<void> => {
  return await db.destroy()
})

test('graphQL query - activeSubGameSessionByUsername - does not allow unauthenticated users', async () => {
  const request: Request = {
    app: {
      locals: {
        db
      }
    }
  } as any as Request
  const response: Response = {
    locals: {
      loaders: {
        userByIdLoader: new DataLoader(UserByIdLoader(KnexUserRepository(db)))
      }
    }
  } as any as Response
  const context = testingContext(request, response)
  const testClient = createTestClient(makeGraphQLServer(app, typeDefs, context, logger))
  return await testClient.query({
    query: gql`
      query SubGameSession {
        activeSubGameSessionByUsername(input: { username: "reactiveangular" }) {
          subGameSession {
            id
          }
        }
      }
    `
  })
    .then(({ errors, data }) => {
      expect(data).toBeNull()
      expect(errors).toHaveLength(1)
      if (errors === undefined) {
        throw new Error('Expected errors')
      }
      expect(errors[0].message).toBe('You must provide valid authentication credentials either through the "Authentication" header as a bearer token or as a cookie. i.e. Header - Authorization: Bearer someToken, Cookie - accessToken: someToken')
      expect(errors[0].extensions?.code).toBe('UNAUTHENTICATED')
    })
})

test('graphQL query - activeSubGameSessionByUsername - errors if the requested sub game user does not exist', async () => {
  const request: Request = {
    user: {},
    app: {
      locals: {
        db,
        userRepository: KnexUserRepository(db)
      }
    }
  } as any as Request
  const response: Response = {
    locals: {
      loaders: {
        userByIdLoader: new DataLoader(UserByIdLoader(KnexUserRepository(db)))
      }
    }
  } as any as Response
  const context = testingContext(request, response)
  const testClient = createTestClient(makeGraphQLServer(app, typeDefs, context, logger))
  return await testClient.query({
    query: gql`
      query SubGameSession {
        activeSubGameSessionByUsername(input: { username: "notAUserThatExists" }) {
          subGameSession {
            id
          }
        }
      }
    `
  })
    .then(({ errors, data }) => {
      expect(data).toBeNull()
      expect(errors).toHaveLength(1)
      if (errors === undefined) {
        throw new Error('Expected errors')
      }
      expect(errors[0].message).toBe('Invalid argument value - user notAUserThatExists - is not signed up for Sub Games Companion')
      expect(errors[0].extensions?.code).toBe('BAD_USER_INPUT')
    })
})

test('graphQL query - activeSubGameSessionByUsername - returns null data if the user does not have an active sub game session', async () => {
  const request: Request = {
    user: {},
    app: {
      locals: {
        db,
        userRepository: KnexUserRepository(db),
        subGameSessionRepository: KnexSubGameSessionRepository(db)
      }
    }
  } as any as Request
  const response: Response = {
    locals: {
      loaders: {
        userByIdLoader: new DataLoader(UserByIdLoader(KnexUserRepository(db)))
      }
    }
  } as any as Response
  const context = testingContext(request, response)
  const testClient = createTestClient(makeGraphQLServer(app, typeDefs, context, logger))
  return await testClient.query({
    query: gql`
      query SubGameSession {
        activeSubGameSessionByUsername(input: { username: "userWithNoActiveSubGames" }) {
          subGameSession {
            id
          }
        }
      }
    `
  })
    .then(({ errors, data }) => {
      expect(errors).toBeUndefined()
      expect(data).not.toBeNull()
      expect(data.activeSubGameSessionByUsername).not.toBeNull()
      expect(data.activeSubGameSessionByUsername.subGameSession).toBeNull()
    })
})

test('graphQL query - activeSubGameSessionByUsername - returns the sub game session data', async () => {
  const request: Request = {
    user: {},
    app: {
      locals: {
        db,
        userRepository: KnexUserRepository(db),
        subGameSessionRepository: KnexSubGameSessionRepository(db)
      }
    }
  } as any as Request
  const response: Response = {
    locals: {
      loaders: {
        userByIdLoader: new DataLoader(UserByIdLoader(KnexUserRepository(db)))
      }
    }
  } as any as Response
  const context = testingContext(request, response)
  const testClient = createTestClient(makeGraphQLServer(app, typeDefs, context, logger))
  return await testClient.query({
    query: gql`
      query SubGameSession {
        activeSubGameSessionByUsername(input: { username: "reactiveangular" }) {
          subGameSession {
            id
            owner {
              id
              username
            }
            isActive
            userMustVerifyEpic
            maxPlayCount
            maxActivePlayers
            queuedPlayers {
              id
            }
            alreadyPlayedUsers {
              id
            }
            activePlayers {
              id
            }
            isSubOnly
          }
        }
      }
    `
  })
    .then(({ errors, data }) => {
      expect(errors).toBeUndefined()
      expect(data).not.toBeNull()
      expect(data.activeSubGameSessionByUsername).not.toBeNull()
      expect(data.activeSubGameSessionByUsername.subGameSession).not.toBeNull()
      expect(data.activeSubGameSessionByUsername.subGameSession).toEqual({
        id: 'U3ViR2FtZVNlc3Npb246MQ==',
        owner: {
          id: 'VXNlcjox',
          username: 'reactiveangular'
        },
        isActive: true,
        userMustVerifyEpic: false,
        maxPlayCount: 1,
        maxActivePlayers: 3,
        queuedPlayers: [],
        alreadyPlayedUsers: [],
        activePlayers: [],
        isSubOnly: true
      })
    })
})

test('graphQL query - activeSubGameSessionByUserId - does not allow unauthenticated users', async () => {
  const request: Request = {
    app: {
      locals: {
        db
      }
    }
  } as any as Request
  const response: Response = {
    locals: {
      loaders: {
        userByIdLoader: new DataLoader(UserByIdLoader(KnexUserRepository(db)))
      }
    }
  } as any as Response
  const context = testingContext(request, response)
  const testClient = createTestClient(makeGraphQLServer(app, typeDefs, context, logger))
  return await testClient.query({
    query: gql`
      query SubGameSession {
        activeSubGameSessionByUserId(input: { userId: "U3ViR2FtZVNlc3Npb246MQ==" }) {
          subGameSession {
            id
          }
        }
      }
    `
  })
    .then(({ errors, data }) => {
      expect(data).toBeNull()
      expect(errors).toHaveLength(1)
      if (errors === undefined) {
        throw new Error('Expected errors')
      }
      expect(errors[0].message).toBe('You must provide valid authentication credentials either through the "Authentication" header as a bearer token or as a cookie. i.e. Header - Authorization: Bearer someToken, Cookie - accessToken: someToken')
      expect(errors[0].extensions?.code).toBe('UNAUTHENTICATED')
    })
})
