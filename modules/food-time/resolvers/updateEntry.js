const knex = require('../../../knex')
const { validateEntryAccess } = require('./helpers')

module.exports = async (_, {time, extra_food, type, vitamin, source, id, }, context) => {
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

  const getBreastFeedingSourceId = () => {
    if (!source) {
      return
    }

    return knex('breast_feeding_sources')
      .select('id')
      .where({ source })
      .first()
      .then(res => res.id)
  }

  await knex('entries')
    .where({id, deleted: false})
    .update({
      time,
      extra_food,
      vitamin,
      feeding_type_id: await getFeedingTypeId(),
      breast_feeding_source_id: await getBreastFeedingSourceId()
    })

  return knex.select('entries.id', 'time', 'extra_food', 'spaceId', 'vitamin', 'feeding_types.type', 'breast_feeding_sources.source')
    .from('entries')
    .innerJoin('feeding_types', 'feeding_types.id', 'entries.feeding_type_id')
    .innerJoin('breast_feeding_sources', 'breast_feeding_sources.id', 'entries.breast_feeding_source_id')
    .orderBy('time', 'desc')
    .where({'entries.id': id})
    .first()
}
