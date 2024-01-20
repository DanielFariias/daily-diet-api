import { randomUUID } from 'node:crypto'

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { knex } from '../../db/database'

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
})

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = createUserBodySchema.parse(request.body)

  const sessionId = randomUUID()

  reply.setCookie('sessionId', sessionId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  await knex('users').insert({
    id: randomUUID(),
    name,
    email,
    password,
    session_id: sessionId,
  })

  return reply.status(201).send()
}
