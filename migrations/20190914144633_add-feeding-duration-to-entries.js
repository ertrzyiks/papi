
exports.up = function(knex) {
  return knex.schema.table('entries', table => {
    table.integer('feeding_duration')
  })
};

exports.down = function(knex) {
  return knex.schema.table('entries', table => {
    table.dropColumn('feeding_duration')
  })
};
