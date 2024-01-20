import { FastifyReply, FastifyRequest } from 'fastify'

import { z } from 'zod'

import { knex } from '../../db/database'

export async function updateMeal(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ mealId: z.string().uuid() })

  const { mealId } = paramsSchema.parse(request.params)

  const updateMealBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    isOnDiet: z.boolean(),
    date: z.coerce.date(),
  })

  const { name, description, isOnDiet, date } = updateMealBodySchema.parse(
    request.body,
  )

  const meal = await knex('meals').where({ id: mealId }).first()

  if (!meal) {
    return reply.status(404).send({ error: 'Meal not found' })
  }

  await knex('meals').where({ id: mealId }).update({
    name,
    description,
    is_on_diet: isOnDiet,
    date: date.getTime(),
  })

  return reply.status(204).send()
}
