const knex = require('../../../knex')
const { validateActivityLogEntryAccess } = require('./helpers')

module.exports = async (_, {id}, context) => {
  await validateActivityLogEntryAccess(id, context.user)

  await knex('activity_log')
    .where({id})
    .update({deleted: true})

  return {
    removedId: id,
    message: 'Entry removed'
  }
}
