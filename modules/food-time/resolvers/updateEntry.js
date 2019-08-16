const knex = require('../../../knex')
const { validateEntryAccess } = require('./helpers')

module.exports = async (_, {time, extra_food, id}, context) => {
  await validateEntryAccess(id, context.user)

  await knex('entries')
    .where({id, deleted: false})
    .update({
      time,
      extra_food,
    })

  return knex.select('id', 'time', 'extra_food', 'spaceId')
    .from('entries')
    .orderBy('time', 'desc')
    .where({id})
    .first()
}
