const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const Sentry = require('@sentry/node')
Sentry.init({ dsn: 'https://82dd777fb8d8437b9a41db7df91cd663@sentry.io/1848905' })

const { typeDefs, resolvers, context } = require('./modules/food-time')

const app = express()

const server = new ApolloServer({ typeDefs, resolvers, context });

server.applyMiddleware({ app, path: '/food-time' })

app.listen(process.env.PORT || 8080, () => {
  console.log('Listening')
})
