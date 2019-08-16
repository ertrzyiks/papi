const subDays = require('date-fns/subDays')
const startOfDay = require('date-fns/startOfDay')

const knex = require('../../../knex')
const { normalize, validateSpaceAccess } = require('./helpers')

module.exports = async (_, {spaceId}, context) => {
  const normalizedSpaceId = await normalize(spaceId)

  await validateSpaceAccess(normalizedSpaceId, context.user)

  return knex.select('id', 'time', 'extra_food', 'spaceId')
    .from('entries')
    .orderBy('time', 'desc')
    .where({
      spaceId: normalizedSpaceId,
      deleted: false,
    })
    .andWhere('time', '>', startOfDay(subDays(new Date(), 3)).getTime() / 1000)
}
