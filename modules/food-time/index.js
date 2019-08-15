const uuid = require('uuid')
const knex = require('../../knex')
const typeDefs = require('./schema')
const subDays = require('date-fns/subDays')
const startOfDay = require('date-fns/startOfDay')
const { loadSpace, spacesForUser, spaceAllowedFor } = require('./models/space')
const { getUser } = require('./models/user')
const { loadEntry } = require('./models/entry')

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

const validateSpaceAccess = async (spaceId, user) => {
  const space = await loadSpace(spaceId)

  if (!space) {
    throw new Error('Not found')
  }

  const allowed = await spaceAllowedFor(space, user)

  if (!allowed) {
    throw new Error('Not found')
  }
}

const validateEntryAccess = async (entryId, user) => {
  const entry = await loadEntry(entryId)

  if (!entry) {
    throw new Error('Not found')
  }

  await validateSpaceAccess(entry.spaceId, user)
}

const resolvers = {
  Query: {
    spaces: (_, {}, context) => {
      return spacesForUser(context.user)
    },
    entries: async (_, {spaceId}, context) => {
      const normalizedSpaceId = await normalize(spaceId)

      await validateSpaceAccess(normalizedSpaceId, context.user)

      return knex.select('id', 'time', 'extra_food', 'spaceId')
        .from('entries')
        .orderBy('time', 'desc')
        .where({
          spaceId: normalizedSpaceId,
          deleted: false,
        })
        .andWhere('time', '>', startOfDay(subDays(new Date(), 3)).getTime() / 1000)
    },
    entry: (_, {id}) => {
      return knex.select('id', 'time', 'extra_food', 'spaceId')
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
    createEntry: async (_, {time, spaceId}, context) => {
      const normalizedSpaceId = await normalize(spaceId)

      await validateSpaceAccess(normalizedSpaceId, context.user)

      const id = uuid.v4()
      const entry = {id, time, extra_food: 0, spaceId: normalizedSpaceId}

      return knex.insert(entry).into('entries').then(() => {
        return entry
      })
    },

    updateEntry: async (_, {time, extra_food, id}, context) => {
      await validateEntryAccess(id, context.user)

      await knex('entries')
        .where({id, deleted: false})
        .update({
          time,
          extra_food,
        })

      return knex.select('id', 'time', 'extra_food', 'spaceId')
        .from('entries')
        .orderBy('time', 'desc')
        .where({id})
        .then(res => {
          if (res && res.length > 0) {
            return res[0]
          }
        })
    },

    removeEntry: async (_, {id}, context) => {
      await validateEntryAccess(id, context.user)

      await knex('entries')
        .where({id})
        .update({deleted: true})

      return {
        removedId: id,
        message: 'Entry removed'
      }
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
