const subDays = require('date-fns/subDays')
const startOfDay = require('date-fns/startOfDay')

const knex = require('../../../knex')
const { normalize, validateSpaceAccess } = require('./helpers')

module.exports = async (_, {spaceId}, context) => {
  const normalizedSpaceId = await normalize(spaceId)

  await validateSpaceAccess(normalizedSpaceId, context.user)

  return knex.select('entries.id', 'time', 'extra_food', 'spaceId', 'vitamin', 'feeding_types.type', 'breast_feeding_sources.source', 'feeding_duration')
    .from('entries')
    .innerJoin('feeding_types', 'feeding_types.id', 'entries.feeding_type_id')
    .leftOuterJoin('breast_feeding_sources', 'breast_feeding_sources.id', 'entries.breast_feeding_source_id')
    .orderBy('time', 'desc')
    .where({
      spaceId: normalizedSpaceId,
      deleted: false,
    })
    .andWhere('time', '>', startOfDay(subDays(new Date(), 3)).getTime() / 1000)
}
