import { Router } from 'express'
import Knex from 'knex'
import UserRepository from '../../shared/interfaces/repositories/user.repository'
import Configuration from '../../shared/interfaces/config'

export default function getV1Router (db: Knex, config: Configuration, userRepository: UserRepository): Router {
  const v1Router = Router()

  // TODO remove route
  v1Router.get('/hello', (req, res) => {
    res.json({ tommy: 'it worksz' })
  })

  return v1Router
}
