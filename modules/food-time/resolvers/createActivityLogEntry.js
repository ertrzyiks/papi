const uuid = require('uuid')

const knex = require('../../../knex')
const { normalize, validateSpaceAccess } = require('./helpers')

module.exports = async (_, {time, spaceId, message}, context) => {
  const normalizedSpaceId = await normalize(spaceId)

  await validateSpaceAccess(normalizedSpaceId, context.user)

  const id = uuid.v4()
  const entry = {
    id,
    time,
    space_id: normalizedSpaceId,
    message
  }

  return knex.insert(entry).into('activity_log')
    .then(() => {
      return { ...entry, spaceId: normalizedSpaceId }
    })
}
