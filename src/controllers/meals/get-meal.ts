import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { knex } from '../../db/database'

export async function GetMeal(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ mealId: z.string().uuid() })

  const { mealId } = paramsSchema.parse(request.params)

  const meal = await knex('meals').where({ id: mealId }).first()

  if (!meal) {
    return reply.status(404).send({ error: 'Meal not found' })
  }

  return {
    results: meal,
  }
}
