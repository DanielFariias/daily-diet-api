import { randomUUID } from 'node:crypto'

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { knex } from '../../db/database'

export async function createMeal(request: FastifyRequest, reply: FastifyReply) {
  const createMealBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    isOnDiet: z.boolean(),
    date: z.coerce.date(),
  })

  const { name, description, isOnDiet, date } = createMealBodySchema.parse(
    request.body,
  )

  await knex('meals').insert({
    id: randomUUID(),
    name,
    description,
    is_on_diet: isOnDiet,
    date: date.getTime(),
    user_id: request.user?.id,
  })

  return reply.status(201).send()
}
