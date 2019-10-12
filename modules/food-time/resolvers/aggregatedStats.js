const knex = require('../../../knex')

module.exports = async (_, {spaceId}, context) => {
  const extraFoodResults = await knex.raw(
    'SELECT MIN(date) AS week_start_date, ROUND(AVG(extra_food),0) AS extra_food  FROM\n' +
    '(SELECT sum(extra_food) AS extra_food, strftime(\'%d/%m/%Y \', datetime(time, \'unixepoch\')) AS date, time, strftime(\'%W\', datetime(time, \'unixepoch\')) AS weekNumber\n' +
    'FROM entries\n' +
    'WHERE spaceId = ?' +
    'AND deleted = 0\n' +
    'GROUP BY date\n' +
    'ORDER BY time DESC)\n' +
    'GROUP BY weekNumber\n' +
    'ORDER BY time\n' +
    'LIMIT 20'
  , [spaceId])

  const feedingCountResults = await knex.raw(
    'SELECT MIN(date) AS week_start_date, ROUND(AVG(feeding_count), 0) AS feeding_count  FROM\n' +
    '(SELECT count(*) AS feeding_count, strftime(\'%d/%m/%Y \', datetime(time, \'unixepoch\')) AS date, time, strftime(\'%W\', datetime(time, \'unixepoch\')) AS weekNumber\n' +
    'FROM entries\n' +
    'WHERE spaceId = ?' +
    'AND deleted = 0\n' +
    'GROUP BY date\n' +
    'ORDER BY time DESC)\n' +
    'GROUP BY weekNumber\n' +
    'ORDER BY time\n' +
    'LIMIT 20'
  , [spaceId])

  return {
    extra_food_per_week: extraFoodResults,
    feeding_count_per_week: feedingCountResults
  }
}
