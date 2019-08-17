const tableName = 'entries'
const columnName = 'feeding_type_id'

exports.up = function(knex) {
  return knex.schema.renameTable(tableName, 'old_entries')
    .then(() => {
      return knex.schema
        .createTable('entries', function (table) {
          table.uuid('id').primary().notNullable()
          table.uuid('spaceId').notNullable()
          table.timestamp('time').notNullable()
          table.integer('extra_food').notNullable()
          table.boolean('deleted').notNull().defaultTo(false)
          table.foreign('spaceId').references('spaces.id')
          table.integer(columnName).notNullable()
          table.foreign(columnName).references('feeding_types.id')
        })
    })
    .then(() => {
      return knex.raw('INSERT INTO entries(id, spaceId, time, extra_food, deleted, feeding_type_id) SELECT id, spaceId, time, extra_food, deleted, 1 FROM old_entries')
    })
    .then(() => {
      return knex(tableName)
        .where('extra_food', '>', 40)
        .update({
          feeding_type_id: 2
        })
    })
    .then(() => {
      return knex(tableName)
        .whereBetween('extra_food', [1, 40])
        .update({
          feeding_type_id: 3
        })
    })
    .then(() => {
      return knex.schema.dropTable('old_entries')
    })
};

exports.down = function(knex) {
};
