import DataLoader from 'dataloader'
import User from './models/user'

// http://expressjs.com/en/api.html#res.locals
export default interface ResponseLocals {
  loaders: {
    userByIdLoader: DataLoader<string, User | null>
  }
}
