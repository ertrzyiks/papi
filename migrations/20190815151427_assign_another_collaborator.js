const uuid = require('uuid')

exports.up = function(knex) {
  const userId = '116dfee3-88db-4a97-9b68-38c32073eddd'
  const spaceId = 'f54dc7be-e6ba-4fbe-ac39-935fae3f23c2'

  return knex.select('id')
    .from('users')
    .where({id: userId})
    .first()
    .then(user => {
      if (!user) return false

      return knex.select('id')
        .from('spaces')
        .where({id: spaceId})
        .first()
    })
    .then(space => {
      if (!space) return

      return knex('collaborators').insert({
        id: uuid.v4(),
        user_id: userId,
        space_id: spaceId
      })
    })
};

exports.down = function(knex) {

};
