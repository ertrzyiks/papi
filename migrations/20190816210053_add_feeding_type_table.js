const tableName = 'feeding_types'

exports.up = function(knex) {
  return knex.schema
    .createTable(tableName, function(table) {
      table.integer('id').primary().notNullable()
      table.string('type', 32).notNullable()
  })
    .then(() => {
      const feedingTypes = [
        { id: 1, type: 'breast' },
        { id: 2, type: 'bottle' },
        { id: 3, type: 'mixed' }
      ]

      return knex(tableName).insert(feedingTypes)
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable(tableName)
};
