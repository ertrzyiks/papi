const uuid = require('uuid')

exports.seed = function(knex) {
  return knex('spaces').del()
    .then(function () {
      return knex.select('id', 'email').from('users')
    })
    .then(function (users) {
      return knex('spaces').insert([
        {id: uuid.v4(), display_name: 'kuba', owner_id: users[0].id}
      ]);
    });
};
