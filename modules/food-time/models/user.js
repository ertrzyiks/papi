const uuid = require('uuid')
const knex = require('../../../knex')
const { verify } = require('../google')

const loadUser = async (email) => {
  return knex
    .select('id', 'email')
    .from('users')
    .where({email})
    .first()

}

const createUser = async (email) => {
  const id = uuid.v4()
  return knex.insert({id, email}).into('users').then(() => {
    return knex
      .select('id', 'email')
      .from('users')
      .where({id})
      .first()
  })
}

const findOrCreateUser = async (email) => {
  let user = await loadUser(email)

  if (!user) {
    user = await createUser(email)
  }

  return user
}

const getUser = async (token) => {
  const payload = await verify(token)

  return await findOrCreateUser(payload.email)
}



module.exports = {
  findOrCreateUser,
  getUser
}
