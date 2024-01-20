import { afterAll, beforeAll, describe, expect, it, beforeEach } from 'vitest'
import { execSync } from 'child_process'
import request from 'supertest'
import { app } from '../app'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback -all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    const userResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '12345678',
    })

    expect(userResponse.status).toBe(201)

    const mealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })

    expect(mealResponse.status).toBe(201)
  })

  it('should be able to list all meals from a user', async () => {
    const userResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '12345678',
    })

    expect(userResponse.status).toBe(201)

    const mealResponse1 = await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })

    expect(mealResponse1.status).toBe(201)

    const mealResponse2 = await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Lunch',
        description: "It's a lunch",
        isOnDiet: true,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day after
      })

    expect(mealResponse2.status).toBe(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .expect(200)

    expect(mealsResponse.body.results).toHaveLength(2)

    // This validate if the order is correct
    expect(mealsResponse.body.results[0].name).toBe('Breakfast')
    expect(mealsResponse.body.results[1].name).toBe('Lunch')
  })

  it('should be able to show a single meal', async () => {
    const userResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '12345678',
    })

    expect(userResponse.status).toBe(201)

    const createMealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })

    expect(createMealResponse.status).toBe(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))

    expect(mealsResponse.status).toBe(200)

    const mealId = mealsResponse.body.results[0].id

    const mealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', userResponse.get('Set-Cookie'))

    expect(mealResponse.status).toBe(200)

    expect(mealResponse.body.results).toEqual(
      expect.objectContaining({
        name: 'Breakfast',
        description: "It's a breakfast",
        is_on_diet: 1,
        date: expect.any(Number),
      }),
    )
  })

  it('should be able to update a meal from a user', async () => {
    const userResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '12345678',
    })

    expect(userResponse.status).toBe(201)

    const createMealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })

    expect(createMealResponse.status).toBe(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))

    expect(mealsResponse.status).toBe(200)

    const mealId = mealsResponse.body.results[0].id

    const updatedMealResponse = await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Dinner',
        description: "It's a dinner",
        isOnDiet: true,
        date: new Date(),
      })

    expect(updatedMealResponse.status).toBe(204)

    const mealUpdatedResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', userResponse.get('Set-Cookie'))

    expect(mealUpdatedResponse.status).toBe(200)

    expect(mealUpdatedResponse.body.results).toEqual(
      expect.objectContaining({
        name: 'Dinner',
        description: "It's a dinner",
        is_on_diet: 1,
        date: expect.any(Number),
      }),
    )
  })

  it('should be able to delete a meal from a user', async () => {
    const userResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '12345678',
    })

    expect(userResponse.status).toBe(201)

    const createMealResponse = await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date(),
      })

    expect(createMealResponse.status).toBe(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))

    expect(mealsResponse.status).toBe(200)

    const mealId = mealsResponse.body.results[0].id

    const deletedMealResponse = await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', userResponse.get('Set-Cookie'))

    expect(deletedMealResponse.status).toBe(204)
  })

  it('should be able to get metrics from a user', async () => {
    const userResponse = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '12345678',
    })

    expect(userResponse.status).toBe(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date('2021-01-01T08:00:00'),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Lunch',
        description: "It's a lunch",
        isOnDiet: false,
        date: new Date('2021-01-01T12:00:00'),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Snack',
        description: "It's a snack",
        isOnDiet: true,
        date: new Date('2021-01-01T15:00:00'),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Dinner',
        description: "It's a dinner",
        isOnDiet: true,
        date: new Date('2021-01-01T20:00:00'),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        name: 'Breakfast',
        description: "It's a breakfast",
        isOnDiet: true,
        date: new Date('2021-01-02T08:00:00'),
      })
      .expect(201)

    const metricsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', userResponse.get('Set-Cookie'))

    expect(metricsResponse.status).toBe(200)

    expect(metricsResponse.body.results).toEqual({
      totalMeals: 5,
      totalMealsOnDiet: 4,
      totalMealsOffDiet: 1,
      bestOnDietSequence: 3,
    })
  })
})
