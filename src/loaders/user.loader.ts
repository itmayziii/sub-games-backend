import { BatchLoadFn } from 'dataloader'
import User from '../interfaces/models/user'
import UserRepository from '../interfaces/repositories/user.repository'
import { find, map, propEq } from 'ramda'

export default function UserByIdLoader (userRepository: UserRepository): BatchLoadFn<string, User | null> {
  return async (ids) => {
    return await userRepository.findMany(ids as string[])
      .then(users => {
        const findByIdOrNull = (user: User): User | null => find<User>(propEq('id', user.id))(users) ?? null
        return map(findByIdOrNull, users)
      })
  }
}
