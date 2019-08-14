
exports.up = function(knex) {
  return knex.select('id').from('spaces').where({display_name: 'kuba'}).first().then(res => {
    if (!res) return

    return knex('entries').where({spaceId: 'kuba'}).update({
      spaceId: res.id
    })
  })
};

exports.down = function(knex) {

};
