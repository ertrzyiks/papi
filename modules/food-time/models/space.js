const uuid = require('uuid')
const knex = require('../../../knex')
const { verify } = require('../google')

const loadSpace = async (email) => {
  return knex
    .select('id', 'email')
    .from('users')
    .where({email})
    .first()

}

const createSpace = async (name) => {
  const id = uuid.v4()
  return knex.insert({id, display_name: name}).into('spaces').then(() => {
    return knex
      .select('id', 'display_name')
      .from('spaces')
      .where({id})
      .first()
  })
}

const findOrCreateSpace = async (name) => {
  let space = await loadSpace(name)

  if (!space) {
    space = await createSpace(name)
  }

  return space
}

module.exports = {
  findOrCreateSpace
}
