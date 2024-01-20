import { FastifyRequest } from 'fastify'

import { knex } from '../../db/database'

export async function ListMeals(request: FastifyRequest) {
  const meals = await knex('meals').where({ user_id: request.user?.id })

  return {
    results: meals,
  }
}
