const knex = require('../../../knex')
const { validateEntryAccess } = require('./helpers')

module.exports = async (_, {time, extra_food, type, id}, context) => {
  await validateEntryAccess(id, context.user)

  const getFeedingTypeId = () => {
    return knex('feeding_types')
      .select('id')
      .where({ type: type })
      .first()
      .then(res => {
        return res.id
      })
  }

  await knex('entries')
    .where({id, deleted: false})
    .update({
      time,
      extra_food,
      feeding_type_id: await getFeedingTypeId()
    })

  return knex.select('entries.id', 'time', 'extra_food', 'spaceId', 'feeding_types.type')
    .from('entries')
    .innerJoin('feeding_types', 'feeding_types.id', 'entries.feeding_type_id')
    .orderBy('time', 'desc')
    .where({'entries.id': id})
    .first()
}
