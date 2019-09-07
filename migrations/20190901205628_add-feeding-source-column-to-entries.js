const tableName = 'entries'

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
          table.integer('feeding_type_id').notNullable()
          table.boolean('vitamin').notNull().defaultTo(false)
          table.integer('breast_feeding_source_id')
          table.foreign('spaceId').references('spaces.id')
          table.foreign('feeding_type_id').references('feeding_types.id')
          table.foreign('breast_feeding_source_id').references('breast_feeding_sources.id')
        })
    })
    .then(() => {
      return knex.raw('INSERT INTO entries(id, spaceId, time, extra_food, deleted, feeding_type_id, vitamin, breast_feeding_source_id) SELECT id, spaceId, time, extra_food, deleted, feeding_type_id, vitamin, 4 FROM old_entries')
    })
    .then(() => {
      return knex.schema.dropTable('old_entries')
    })
};

exports.down = function(knex) {
  
};
