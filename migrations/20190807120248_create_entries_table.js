
exports.up = function(knex) {
  return knex.schema
    .createTable('entries', function (table) {
      table.uuid('id').primary().notNullable()
      table.string('spaceId', 64).notNullable()
      table.timestamp('time').notNullable()
      table.integer('extra_food').notNullable()
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable('entries')
}
