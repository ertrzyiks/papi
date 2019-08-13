
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.uuid('id').primary().notNullable()
      table.string('email', 255).notNullable()
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('users')
};
