
exports.up = function(knex) {
  return knex.schema
    .createTable('collaborators', function (table) {
      table.uuid('id').primary().notNullable()
      table.uuid('space_id').notNullable()
      table.uuid('user_id').notNullable()
      table.foreign('space_id').references('spaces.id')
      table.foreign('user_id').references('users.id')
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('collaborators')
};
