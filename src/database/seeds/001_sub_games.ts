import * as Knex from 'knex'

async function clearDatabase (knex: Knex): Promise<void> {
  return await knex('userSubGameSessionHistory').del()
    .then(() => knex('userSubGameSessionActive').del())
    .then(() => knex('userSubGameSessionQueue').del())
    .then(() => knex('subGameSession').del())
    .then(() => knex('user').del())
}

async function insertUsers (knex: Knex): Promise<void> {
  return await knex('user').insert([
    {
      id: 1,
      username: 'reactiveangular',
      refreshToken: null,
      twitchAccessToken: '123',
      twitchRefreshToken: '456',
      lastTwitchValidation: null
    },
    {
      id: 2,
      username: 'userWithNoActiveSubGames',
      refreshToken: null,
      twitchAccessToken: '123',
      twitchRefreshToken: '456',
      lastTwitchValidation: null
    }
  ])
}

async function insertSubGameSessions (knex: Knex): Promise<void> {
  return await knex('subGameSession').insert([
    {
      id: 1,
      ownerId: 1
    }
  ])
}

export async function seed (knex: Knex): Promise<void> {
  return await clearDatabase(knex)
    .then(async () => await insertUsers(knex))
    .then(async () => await insertSubGameSessions(knex))
}
