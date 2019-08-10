const uuid = require('uuid')
const knex = require('../../knex')
const typeDefs = require('./schema')

const normalize = (spaceId) => spaceId.toLowerCase()

let spaces = {
  kuba: {
    name: 'Kuba'
  }
}

const resolvers = {
  Query: {
    space: (_, {id}) => {
      return spaces[id]
    },
    entries: (_, {spaceId}) => {
      return knex.select('id', 'time', 'extra_food')
        .from('entries')
        .orderBy('time', 'desc')
        .where({spaceId: normalize(spaceId), deleted: false})
    },
    entry: (_, {id}) => {
      return knex.select('id', 'time', 'extra_food')
        .from('entries')
        .orderBy('time', 'desc')
        .where({id, deleted: false})
        .then(res => {
          if (res && res.length > 0) {
            return res[0]
          }
        })
    }
  },
  Mutation: {
    createEntry: async (_, {time, spaceId}) => {
      if (typeof spaces[normalize(spaceId)] === 'undefined') {
        throw new Error('Unknown space')
      }

      const id = uuid.v4()
      const entry = {id, time, extra_food: 0, spaceId: normalize(spaceId)}

      return knex.insert(entry).into('entries').then(() => {
        return entry
      })
    },

    updateEntry: async (_, {time, extra_food, id}) => {
      return knex('entries')
        .where({id, deleted: false})
        .update({
          time,
          extra_food,
        })
        .then(() => {
          return knex.select('id', 'time', 'extra_food')
            .from('entries')
            .orderBy('time', 'desc')
            .where({id})
            .then(res => {
              if (res && res.length > 0) {
                return res[0]
              }
            })
        })
    },

    removeEntry: async (_, {id}) => {
      return knex('entries')
        .where({id})
        .update({deleted: true}).then(() => {
          return {
            removedId: id,
            message: 'Entry removed'
          }
        })
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
}
