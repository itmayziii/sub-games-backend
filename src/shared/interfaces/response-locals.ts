import DataLoader from 'dataloader'
import User from './models/user'
import { JWTPayload } from './jwt'

// http://expressjs.com/en/api.html#res.locals
export default interface ResponseLocals {
  jwtPayload?: JWTPayload
  loaders: {
    userByIdLoader: DataLoader<string, User | null>
    userByUsernameLoader: DataLoader<string, User | null>
  }
}
