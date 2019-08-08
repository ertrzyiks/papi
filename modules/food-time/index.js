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
        .where({spaceId: normalize(spaceId)})
    },
    entry: (_, {id}) => {
      return knex.select('id', 'time', 'extra_food')
        .from('entries')
        .orderBy('time', 'desc')
        .where({id})
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

    updateEntry: async (_, {time, id}) => {
      return knex('entries')
        .where({id})
        .update({
          time: time,
          extra_food: undefined,
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
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
}
