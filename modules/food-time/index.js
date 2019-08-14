const uuid = require('uuid')
const knex = require('../../knex')
const typeDefs = require('./schema')
const subDays = require('date-fns/subDays')
const startOfDay = require('date-fns/startOfDay')
const { spacesForUser } = require('./models/space')
const { getUser } = require('./models/user')

const normalize = async (spaceId) => {
  const lowerSpaceId = spaceId.toLowerCase()

  const res = await knex.select('id').from('spaces').where({display_name: lowerSpaceId}).first()

  return (res && res.id) || lowerSpaceId
}

let spaces = {
  kuba: {
    name: 'Kuba'
  }
}

const resolvers = {
  Query: {
    spaces: (_, {}, context) => {
      return spacesForUser(context.user)
    },
    entries: async (_, {spaceId}) => {
      return knex.select('id', 'time', 'extra_food')
        .from('entries')
        .orderBy('time', 'desc')
        .where({
          spaceId: await normalize(spaceId),
          deleted: false,
        })
        .andWhere('time', '>', startOfDay(subDays(new Date(), 3)).getTime() / 1000)
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
      const id = uuid.v4()
      const entry = {id, time, extra_food: 0, spaceId: await normalize(spaceId)}

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
}

const context = async ({ req }) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '')

  const user = await getUser(token)

  if (!user) throw new Error('you must be logged in')

  return { user }
}

module.exports = {
  typeDefs,
  resolvers,
  context
}
