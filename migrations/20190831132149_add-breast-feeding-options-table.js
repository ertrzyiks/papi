const tableName = 'breast_feeding_sources'

exports.up = function(knex) {
  return knex.schema
    .createTable(tableName, function (table) {
      table.integer('id').primary().notNullable()
      table.string('source', 32).notNullable()
    })
    .then(() => {
      const sources = [
        { id: 1, source: 'left' },
        { id: 2, source: 'right' },
        { id: 3, source: 'both' },
        { id: 4, source: 'none' }
      ]

      return knex(tableName).insert(sources)
    })
}

exports.down = function(knex) {
  return knex.schema
    .dropTable(tableName)
};
