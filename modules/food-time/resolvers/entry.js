const knex = require('../../../knex')
const { validateEntryAccess } = require('./helpers')

module.exports = async (_, {id}, context) => {
  await validateEntryAccess(id, context.user)

  return knex.select('id', 'time', 'extra_food', 'spaceId')
    .from('entries')
    .where({id, deleted: false})
    .first()
}
