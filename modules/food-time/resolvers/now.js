const format = require('date-fns/format')
const { utcToZonedTime } = require('date-fns-tz')

module.exports = async (_, {spaceId}, context) => {
  if (context.user !== 'bot') {
    throw new Error('Not found')
  }

  const utcTime = utcToZonedTime(Date.now(), 'Europe/Warsaw')
  return format(utcTime, 'HH:mm')
}

