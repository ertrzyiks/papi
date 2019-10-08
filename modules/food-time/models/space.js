const uuid = require('uuid')
const knex = require('../../../knex')

const loadSpace = async (spaceId) => {
  return knex
    .select('id', 'display_name', 'owner_id')
    .from('spaces')
    .where({id: spaceId})
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

const spacesForUser = async (user) => {
  const spacesFromCollaboration = await knex
    .select('space_id')
    .from('collaborators')
    .where({user_id: user.id})
    .map(c => c.space_id)

  return await knex
    .select('id', 'display_name')
    .from('spaces')
    .whereIn('id', spacesFromCollaboration)
    .orWhere({ owner_id: user.id })
}

const spaceAllowedFor = async (space, user) => {
  if (space.owner_id === user.id) {
    return true
  }

  const numberOfCollaboratorRows = await knex('collaborators')
    .count('id', {as: 'count'})
    .where({
      user_id: user.id,
      space_id: space.id
    })
    .first()

  return numberOfCollaboratorRows.count > 0
}

module.exports = {
  loadSpace,
  spacesForUser,
  spaceAllowedFor
}
