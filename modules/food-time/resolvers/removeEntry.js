const knex = require('../../../knex')
const { validateEntryAccess } = require('./helpers')

module.exports = async (_, {id}, context) => {
  await validateEntryAccess(id, context.user)

  await knex('entries')
    .where({id})
    .update({deleted: true})

  return {
    removedId: id,
    message: 'Entry removed'
  }
}
