import { FastifyInstance } from 'fastify'

import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

import { createMeal } from '../controllers/meals/create-meal'
import { getMetrics } from '../controllers/meals/get-metrics'
import { updateMeal } from '../controllers/meals/update-meal'
import { deleteMeal } from '../controllers/meals/delete-meal'
import { ListMeals } from '../controllers/meals/list-meals'
import { GetMeal } from '../controllers/meals/get-meal'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkSessionIdExists)

  app.get('/', ListMeals)

  app.get('/:mealId', GetMeal)

  app.post('/', createMeal)

  app.put('/:mealId', updateMeal)

  app.delete('/:mealId', deleteMeal)

  app.get('/metrics', getMetrics)
}
