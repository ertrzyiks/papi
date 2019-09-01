const knex = require('../../../knex')
const format = require('date-fns/format')
const differenceInHours = require('date-fns/differenceInHours')
const differenceInMinutes = require('date-fns/differenceInMinutes')
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
      const utcTime = utcToZonedTime(time * 1000, 'Europe/Warsaw')
      const formattedTime = format(utcTime, 'HH:mm')

      const diffInMinutes = differenceInMinutes(new Date(), new Date(time * 1000))

      let diff
      if (diffInMinutes >= 60) {
        diff = `${Math.floor(diffInMinutes/60)}h ${diffInMinutes % 60}min`
      } else {
        diff = `${diffInMinutes}min`
      }
      return `${formattedTime} - ${diff} ago`
    })
}

