const knex = require('../../../knex')
const groupBy = require('lodash.groupby');
const mean = require('lodash.mean');

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

    const averageDayBreakResults = await knex.raw(
      'SELECT  strftime(\'%d/%m/%Y \', datetime(T1.time, \'unixepoch\')) \n' +
      '    as date,\n' +
      '    Cast ((\n' +
      '            JulianDay(T1.time, \'unixepoch\') - JulianDay(MAX(T2.time), \'unixepoch\')\n' +
      '        ) * 24 * 60 as INT) as timeSinceLastFeeding,\n' +
      '    T1.spaceId, T1.time,\n' +
      '    MAX(T2.time) AS time2,\n' +
      '    ROW_NUMBER() OVER(PARTITION BY strftime(\'%d/%m/%Y \', datetime(T1.time, \'unixepoch\')) ORDER BY T1.time) AS seqId\n' +
      '       from entries T1\n' +
      '     LEFT JOIN entries T2\n' +
      '            ON T1.spaceId = T2.spaceId\n' +
      '            AND T2.time < T1.time\n' +
      '    GROUP BY T1.spaceId, date, T1.time\n' +
      '    having T1.time > CAST(strftime(\'%s\', \'now\', \'-30 days\') AS INT)\n' +
      '          order by T1.time DESC'
    )
      .then(data => {
        const grouped = groupBy(data, 'date')
        const res = Object.keys(grouped).map(date => {
          const dayFeedingData = grouped[date]
          if (!dayFeedingData) {
            return
          }

          const durations = dayFeedingData
            .map(el => {
              return el.seqId > 2 ? el.timeSinceLastFeeding : null
            })
            .filter(el => el != null)

          return {
            date,
            average_duration_mins: durations.length > 0 ? Math.floor(mean(durations)) : null
          }
        })

        return res.reverse()
      })

  return {
    extra_food_per_day: extraFoodResults,
    feeding_count_per_day: feedingCountResults,
    night_breaks: nightBreaksResults,
    average_day_break: averageDayBreakResults
  }
}
