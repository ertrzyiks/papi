const knex = require('../../../knex')

const loadEntry = async (spaceId) => {
  return knex
    .select('id', 'time', 'extra_food', 'spaceId')
    .from('entries')
    .where({id: spaceId, deleted: false})
    .first()
}

module.exports = {
  loadEntry
}
