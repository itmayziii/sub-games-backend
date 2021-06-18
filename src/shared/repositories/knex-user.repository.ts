import User from '../interfaces/models/user'
import * as Knex from 'knex'
import UserRepository from '../interfaces/repositories/user.repository'

export default function KnexUserRepository (db: Knex): UserRepository {
  const userRepository: UserRepository = {
    async find (id) {
      return await db('user').first().where({ id })
    },
    async findMany (ids) {
      return await db('user').whereIn('id', ids)
    },
    async createOrUpdate (id, user) {
      return await userRepository.find(id)
        .then(async (matchedUser) => {
          const userTable = db.table('user')
          if (matchedUser === undefined) {
            return await userTable.insert(user).returning<User[]>('*')
          }

          return await userTable.update(user).where({ id }).returning<User[]>('*')
        })
        .then(result => result[0])
    },
    async update (id, user) {
      return await db('user').update(user).where({ id }).returning<User[]>('*')
        .then(result => result[0])
    },
    async findByRefreshToken (refreshToken) {
      return await db('user').first<User>().where({ refreshToken })
    },
    async findByUsername (username) {
      return await db<User>('user').first().where({ username })
    },
    async findManyByUsername (usernames) {
      return await db<User>('user').whereIn('username', usernames)
    }
  }

  return userRepository
}
