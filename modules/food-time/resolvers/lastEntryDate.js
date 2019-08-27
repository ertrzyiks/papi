const knex = require('../../../knex')

module.exports = async (_, {spaceId}, context) => {
  if (context.user !== 'bot') {
    throw new Error('Not found')
  }

  return knex
    .select('time')
    .from('entries')
    .where({spaceId})
    .orderBy('time', 'desc')
    .first()
    .then(({time}) => {
      return time
    })
}

