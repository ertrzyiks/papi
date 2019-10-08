const knex = require('../../../knex')

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

  return {
    extra_food_per_day: extraFoodResults,
    feeding_count_per_day: feedingCountResults
  }
}
