
exports.up = function(knex) {
  return knex.schema.renameTable('entries', 'old_entries')
    .then(() => {
      return knex.schema
        .createTable('entries', function (table) {
          table.uuid('id').primary().notNullable()
          table.uuid('spaceId').notNullable()
          table.timestamp('time').notNullable()
          table.integer('extra_food').notNullable()
          table.boolean('deleted').notNull().defaultTo(false)
          table.foreign('spaceId').references('spaces.id')
        })
    })
    .then(() => {
      return knex.raw('INSERT INTO entries(id, spaceId, time, extra_food) SELECT id, spaceId, time, extra_food FROM old_entries')
    })
    .then(() => {
      return knex.schema.dropTable('old_entries')
    })
};

exports.down = function(knex) {

};
