import User from "../interfaces/user";
import * as Knex from 'knex'

export default function UserRepository(db: Knex) {
  const userRepository = {
    find(id: string): Promise<User | undefined> {
      return db.first().from('user').where({ id })
    },
    createOrUpdate(id: string, user: Partial<User>): Promise<User> {
      return userRepository.find(id)
        .then((matchedUser): Promise<User[]> => {
          const userTable = db.table('user')
          if (matchedUser) {
            return userTable.update(user).where({ id }).returning<User[]>('*')
          }

          return userTable.insert(user).returning<User[]>('*')
        })
        .then(result => result[0])
    },
    update(id: string, user: Partial<User>): Promise<User> {
      return db('user').update(user).returning<User[]>('*')
        .then(result => result[0])
    },
    findByRefreshToken(refreshToken: string): Promise<User | undefined> {
      return db.first<User>().from('user').where({refreshToken})
    },
    findByUsername(username: string): Promise<User | undefined> {
      return db<User>('user').first().where({ username })
    }
  }

  return userRepository
}
