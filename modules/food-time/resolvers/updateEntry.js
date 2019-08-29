const knex = require('../../../knex')
const { validateEntryAccess } = require('./helpers')

module.exports = async (_, {time, extra_food, type, vitamin, id}, context) => {
  await validateEntryAccess(id, context.user)

  const getFeedingTypeId = () => {
    if (!type) {
      return
    }

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
      vitamin,
      feeding_type_id: await getFeedingTypeId()
    })

  return knex.select('entries.id', 'time', 'extra_food', 'spaceId', 'vitamin', 'feeding_types.type')
    .from('entries')
    .innerJoin('feeding_types', 'feeding_types.id', 'entries.feeding_type_id')
    .orderBy('time', 'desc')
    .where({'entries.id': id})
    .first()
}
