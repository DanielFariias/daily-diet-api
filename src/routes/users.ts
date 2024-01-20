import { FastifyInstance } from 'fastify'

import { createUser } from '../controllers/users/create-user'
import { listUsers } from '../controllers/users/list-users'

export async function userRoutes(app: FastifyInstance) {
  app.get('/', listUsers)

  app.post('/', createUser)
}
