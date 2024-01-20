import { knex } from '../../db/database'

export async function listUsers() {
  const users = await knex('users').select('*')

  return { results: users }
}
