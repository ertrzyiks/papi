const knex = require('../../../knex')
const groupBy = require('lodash.groupby');

module.exports = async (_, {spaceId}, context) => {
  const extraFoodResults = await knex
    .select('*')
    .from(function() {
      this.sum('extra_food as extra_food')
        .select(knex.raw('strftime(\'%d/%m/%Y \', datetime(time, \'unixepoch\')) as date'), 'time')
        .from('entries')
        .where({spaceId})
        .groupBy('date')
        .orderBy('time', 'desc')
        .limit(30)
    })
    .orderBy('time')

  const feedingCountResults = await knex
    .select('*')
    .from(function() {
      this.count('* as feeding_count')
        .select(knex.raw('strftime(\'%d/%m/%Y \', datetime(time, \'unixepoch\')) as date'), 'time')
        .from('entries')
        .where({spaceId})
        .groupBy('date')
        .orderBy('time', 'desc')
        .limit(30)
    })
    .orderBy('time')

  const nightBreaksResults = await knex.raw(
    'SELECT strftime(\'%d/%m/%Y \', datetime(T1.time, \'unixepoch\')) \n' +
    '    AS date,\n' +
    '    Cast ((\n' +
    '      JulianDay(T1.time, \'unixepoch\') - JulianDay(MAX(T2.time), \'unixepoch\')\n' +
    '    ) * 24 * 60 as INT) as timeSinceLastFeedingMins,\n' +
    '    T1.spaceId, T1.time,\n' +
    '    MAX(T2.time) AS time2\n' +
    '      FROM entries T1\n' +
    '    LEFT JOIN entries T2\n' +
    '      ON T1.spaceId = T2.spaceId\n' +
    '      AND T2.time < T1.time\n' +
    '    GROUP BY T1.spaceId, date, T1.time\n' +
    '    HAVING T1.time > CAST(strftime(\'%s\', \'now\', \'-30 days\') AS INT)\n' +
    '    ORDER BY T1.time DESC'
    )
    .then(data => {
      const grouped = groupBy(data, 'date')
      return Object.keys(grouped).map(date => {
        const value = grouped[date]

        return {
          date: date,
          firstBreakDurationInMins: value && value.length > 0 ? value[value.length - 1].timeSinceLastFeedingMins : null,
          secondBreakDurationInMins: value && value.length > 1 ? value[value.length - 2].timeSinceLastFeedingMins : null
        }
      }).reverse()

    })

  return {
    extra_food_per_day: extraFoodResults,
    feeding_count_per_day: feedingCountResults,
    night_breaks: nightBreaksResults
  }
}
