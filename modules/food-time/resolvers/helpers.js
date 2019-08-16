const knex = require('../../../knex')
const { loadSpace, spaceAllowedFor } = require('../models/space')
const { loadEntry } = require('../models/entry')

const normalize = async (spaceId) => {
  const lowerSpaceId = spaceId.toLowerCase()

  const res = await knex.select('id').from('spaces').where({display_name: lowerSpaceId}).first()

  return (res && res.id) || lowerSpaceId
}

const validateSpaceAccess = async (spaceId, user) => {
  const space = await loadSpace(spaceId)

  if (!space) {
    throw new Error('Not found')
  }

  const allowed = await spaceAllowedFor(space, user)

  if (!allowed) {
    throw new Error('Not found')
  }
}

const validateEntryAccess = async (entryId, user) => {
  const entry = await loadEntry(entryId)

  if (!entry) {
    throw new Error('Not found')
  }

  await validateSpaceAccess(entry.spaceId, user)
}

module.exports = {
  normalize,
  validateSpaceAccess,
  validateEntryAccess
}
