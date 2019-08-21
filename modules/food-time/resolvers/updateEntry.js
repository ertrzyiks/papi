const knex = require('../../../knex')
const { validateEntryAccess } = require('./helpers')

module.exports = async (_, {time, extra_food, id}, context) => {
  await validateEntryAccess(id, context.user)

  const getFeedingTypeId = () => {
    if (!extra_food) {
      return 1
    }

    if (extra_food > 40) {
      return 2
    }

    return 3
  }

  await knex('entries')
    .where({id, deleted: false})
    .update({
      time,
      extra_food,
      feeding_type_id: getFeedingTypeId()
    })

  return knex.select('entries.id', 'time', 'extra_food', 'spaceId', 'feeding_types.type')
    .from('entries')
    .innerJoin('feeding_types', 'feeding_types.id', 'entries.feeding_type_id')
    .orderBy('time', 'desc')
    .where({'entries.id': id})
    .first()
}
