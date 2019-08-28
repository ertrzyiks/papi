const knex = require('../../../knex')
const format = require('date-fns/format')
const { utcToZonedTime } = require('date-fns-tz')

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
      return format(utcToZonedTime(time * 1000, 'Europe/Warsaw'), 'HH:mm')
    })
}

