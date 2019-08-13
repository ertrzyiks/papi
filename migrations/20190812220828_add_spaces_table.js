
exports.up = function(knex) {
  return knex.schema
    .createTable('spaces', function (table) {
      table.uuid('id').primary().notNullable()
      table.string('display_name', 255).notNullable()
      table.uuid('owner_id').notNullable()
      table.foreign('owner_id').references('users.id')
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('spaces')
};
