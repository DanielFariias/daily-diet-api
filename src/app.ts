import fastify from 'fastify'
import { userRoutes } from './routes/users'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyCookie)

app.register(userRoutes, { prefix: '/users' })
