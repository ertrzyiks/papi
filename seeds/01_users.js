const uuid = require('uuid')

const makeEmail = (name, separator) => {
  return `${name.split(' ').join(separator || '').toLowerCase()}@gmail.com`
}

exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {id: uuid.v4(), email: makeEmail('Mateusz Derks')},
        {id: uuid.v4(), email: makeEmail('Joanna Derks', '.')},
      ]);
    });
};
