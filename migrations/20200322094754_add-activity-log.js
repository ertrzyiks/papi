
exports.up = function(knex) {
  return knex.schema
    .createTable('activity_log', function (table) {
      table.uuid('id').primary().notNullable()
      table.uuid('space_id').notNullable()
      table.timestamp('time').notNullable()
      table.string('message', 255).notNullable()
      table.boolean('deleted').notNull().defaultTo(false)
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('activity_log')
};
