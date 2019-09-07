const uuid = require('uuid')

const knex = require('../../../knex')
const { normalize, validateSpaceAccess } = require('./helpers')

module.exports = async (_, {time, spaceId}, context) => {
  const normalizedSpaceId = await normalize(spaceId)

  await validateSpaceAccess(normalizedSpaceId, context.user)

  const id = uuid.v4()
  const entry = {
    id,
    time,
    extra_food: 0,
    spaceId: normalizedSpaceId,
    feeding_type_id: 1,
    vitamin: false,
    breast_feeding_source_id: 4
  }

  return knex.insert(entry).into('entries')
    .then(() => {
    return Object.assign({}, entry, { type: 'breast' })
  })
}
