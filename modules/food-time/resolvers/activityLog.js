const subDays = require('date-fns/subDays')
const startOfDay = require('date-fns/startOfDay')

const knex = require('../../../knex')
const { normalize, validateSpaceAccess } = require('./helpers')

module.exports = async (_, {spaceId}, context) => {
  const normalizedSpaceId = await normalize(spaceId)

  await validateSpaceAccess(normalizedSpaceId, context.user)

  return knex.select('id', 'time', 'message', 'space_id as spaceId')
    .from('activity_log')
    .orderBy('time', 'desc')
    .where({
      space_id: normalizedSpaceId,
      deleted: false,
    })
    .andWhere('time', '>', startOfDay(subDays(new Date(), 3)).getTime() / 1000)
}
