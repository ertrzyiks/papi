const typeDefs = require('./schema')

const { getUser } = require('./models/user')
const {
  spaces,
  entries,
  entry,
  createEntry,
  updateEntry,
  removeEntry
} = require('./resolvers')

const resolvers = {
  Query: {
    spaces,
    entries,
    entry
  },
  Mutation: {
    createEntry,
    updateEntry,
    removeEntry
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
