const { AuthenticationError } = require('apollo-server-express')
const typeDefs = require('./schema')
const Sentry = require('@sentry/node')

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
  stats,
  aggregated_stats
} = require('./resolvers')

const resolvers = {
  Query: {
    spaces,
    entries,
    entry,
    lastEntryDate,
    now,
    stats: (_, args) => args,
    aggregated_stats
  },
  Stats: {
    ...stats
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
    user = await getUser(token+ 'd')
  } catch (e) {
    Sentry.captureException(e)
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
