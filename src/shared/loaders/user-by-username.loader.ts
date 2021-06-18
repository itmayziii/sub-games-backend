import DataLoader from 'dataloader'
import User from '../interfaces/models/user'
import UserRepository from '../interfaces/repositories/user.repository'
import { find, map, propEq } from 'ramda'

/**
 * Ensure we return null to the data loader for users that are not found.
 */
function normalizeUsers (users: User[]): Array<User|null> {
  const findByIdOrNull = (user: User): User | null => find<User>(propEq('id', user.id))(users) ?? null
  return map(user => findByIdOrNull(user), users)
}

export default function UserByUsernameLoader (userRepository: UserRepository): DataLoader<string, User | null> {
  return new DataLoader(async (usernames) => {
    return await userRepository.findManyByUsername(usernames as string[])
      .then(users => normalizeUsers(users))
  })
}
