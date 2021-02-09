import User from '../interfaces/user'
import * as Knex from 'knex'

interface UserRepo {
  find: (id: string) => Promise<User | undefined>
  createOrUpdate: (id: string, user: Partial<User>) => Promise<User>
  update: (id: string, user: Partial<User>) => Promise<User>
  findByRefreshToken: (refreshToken: string) => Promise<User | undefined>
  findByUsername: (username: string) => Promise<User | undefined>
}

export default function UserRepository (db: Knex): UserRepo {
  const userRepository: UserRepo = {
    async find (id) {
      return await db.first().from('user').where({ id })
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
      return await db.first<User>().from('user').where({ refreshToken })
    },
    async findByUsername (username) {
      return await db<User>('user').first().where({ username })
    }
  }

  return userRepository
}
