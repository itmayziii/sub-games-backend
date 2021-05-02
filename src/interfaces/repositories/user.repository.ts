import User from '../models/user'
import * as Knex from 'knex'

export type CreateOrUpdateUser = Omit<User, 'lastTwitchValidation'> & { lastTwitchValidation: Knex.Raw | string }
export type UpdateUser = Omit<User, 'lastTwitchValidation'> & { lastTwitchValidation: Knex.Raw | string }
export default interface UserRepository {
  find: (id: string) => Promise<User | undefined>
  findMany: (ids: string[]) => Promise<User[]>
  createOrUpdate: (id: string, user: Partial<CreateOrUpdateUser>) => Promise<User>
  update: (id: string, user: Partial<UpdateUser>) => Promise<User>
  findByRefreshToken: (refreshToken: string) => Promise<User | undefined>
  findByUsername: (username: string) => Promise<User | undefined>
}
