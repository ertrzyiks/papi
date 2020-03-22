const knex = require('../../../knex')

const loadActivityLogEntry = async (spaceId) => {
  return knex
    .select('id', 'time', 'message', 'space_id')
    .from('activity_log')
    .where({id: spaceId, deleted: false})
    .first()
}

module.exports = {
  loadActivityLogEntry
}
