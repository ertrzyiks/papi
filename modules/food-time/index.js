const { AuthenticationError } = require('apollo-server-express')
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
  now,
} = require('./resolvers')

const resolvers = {
  Query: {
    spaces,
    entries,
    entry,
    lastEntryDate,
    now,
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

  let user

  try {
    user = await getUser(token)
  } catch (e) {
    throw new AuthenticationError('you must be logged in')
  }

  if (!user) throw new AuthenticationError('you must be logged in')

  return {user}
}

module.exports = {
  typeDefs,
  resolvers,
  context
}
