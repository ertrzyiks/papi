const knex = require('../../../knex')
const { validateActivityLogEntryAccess } = require('./helpers')

module.exports = async (_, {id}, context) => {
  await validateActivityLogEntryAccess(id, context.user)

  return knex.select('id', 'time', 'message', 'space_id as spaceId')
    .from('activity_log')
    .where({'id': id, deleted: false})
    .first()
}
