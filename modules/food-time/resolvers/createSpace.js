const uuid = require('uuid')

const knex = require('../../../knex')

module.exports = async (_, {name}, context) => {
  const id = uuid.v4()
  const space = {
    id,
    display_name: name,
    owner_id: context.user.id
  }

  return knex.insert(space).into('spaces')
    .then(() => {
      return space
    })
}
