const knex = require('../../../knex')
const { validateEntryAccess } = require('./helpers')

module.exports = async (_, {id}, context) => {
  await validateEntryAccess(id, context.user)

  return knex.select('entries.id', 'time', 'extra_food', 'spaceId', 'vitamin', 'feeding_types.type', 'breast_feeding_sources.source')
    .from('entries')
    .innerJoin('feeding_types', 'feeding_types.id', 'entries.feeding_type_id')
    .leftOuterJoin('breast_feeding_sources', 'breast_feeding_sources.id', 'entries.breast_feeding_source_id')
    .where({'entries.id': id, deleted: false})
    .first()
}
