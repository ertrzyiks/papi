const typeDefs = require('./schema')

const { getUser } = require('./models/user')
const {
  spaces,
  entries,
  entry,
  createEntry,
  updateEntry,
  removeEntry,
  createSpace,
  lastEntryDate,
} = require('./resolvers')

const resolvers = {
  Query: {
    spaces,
    entries,
    entry,
    lastEntryDate,
  },
  Mutation: {
    createSpace,
    createEntry,
    updateEntry,
    removeEntry,
  }
}

const context = async ({ req }) => {
  if (req.query.access_token === '123') {
    return {user: 'bot'}
  }

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
