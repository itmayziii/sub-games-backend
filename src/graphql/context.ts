import AppLocals from '../interfaces/app-locals'
import User from '../interfaces/models/user'
import { GraphQLContext } from '../interfaces/graphql'
import { ExpressContext } from 'apollo-server-express'
import ResponseLocals from '../interfaces/response-locals'

export default function context ({ req, res }: ExpressContext): GraphQLContext {
  const appLocals = req.app.locals as AppLocals
  const responseLocals = res.locals as ResponseLocals
  return {
    config: appLocals.config,
    user: req.user as User | undefined,
    db: appLocals.db,
    userRepository: appLocals.userRepository,
    approvedStreamerRepository: appLocals.approvedStreamerRepository,
    subGameSessionRepository: appLocals.subGameSessionRepository,
    logger: appLocals.logger,
    TwitchService: appLocals.TwitchService,
    loaders: responseLocals.loaders,
    req,
    res
  }
}
