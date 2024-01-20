import { FastifyRequest } from 'fastify'

import { knex } from '../../db/database'

export async function getMetrics(request: FastifyRequest) {
  const totalMeals = await knex('meals')
    .where({ user_id: request.user?.id })
    .orderBy('date', 'desc')

  const { bestOnDietSequence, totalMealsOffDiet, totalMealsOnDiet } =
    totalMeals.reduce(
      (acc, meal) => {
        if (meal.is_on_diet) {
          acc.currentSequence += 1
          acc.totalMealsOnDiet += 1
        } else {
          acc.currentSequence = 0
          acc.totalMealsOffDiet += 1
        }

        if (acc.currentSequence > acc.bestOnDietSequence) {
          acc.bestOnDietSequence = acc.currentSequence
        }

        return acc
      },
      {
        bestOnDietSequence: 0,
        currentSequence: 0,
        totalMealsOnDiet: 0,
        totalMealsOffDiet: 0,
      },
    )

  return {
    results: {
      totalMeals: totalMeals.length,
      totalMealsOnDiet,
      totalMealsOffDiet,
      bestOnDietSequence,
    },
  }
}
