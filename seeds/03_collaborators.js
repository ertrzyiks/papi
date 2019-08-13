const uuid = require('uuid')

exports.seed = function(knex) {
  return knex('collaborators').del()
    .then(function () {
      return Promise.all([
        knex.select('id', 'email').from('users'),
        knex.select('id').from('spaces')
      ])
    })
    .then(function (data) {
      const users = data[0]
      const spaces = data[1]

      let collaborators = []

      for (let i = 0; i < spaces.length; i++) {
        for (let j = 1; j < users.length; j++) {
          collaborators.push({
            id: uuid.v4(),
            space_id: spaces[i].id,
            user_id: users[j].id
          })
        }
      }

      return knex('collaborators').insert(collaborators);
    });
};
