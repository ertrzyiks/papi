
exports.up = function(knex) {
  return knex.select('id').from('spaces').where({display_name: 'kuba'}).first().then(({id}) => {
    return knex('entries').where({spaceId: 'kuba'}).update({
      spaceId: id
    })
  })
};

exports.down = function(knex) {

};
