
exports.up = function(knex) {
  return knex.schema.table('entries', table => {
    table.boolean('vitamin').notNull().defaultTo(false)
  })
};

exports.down = function(knex) {
  return knex.schema.table('entries', table => {
    table.dropColumn('deleted')
  })
};
