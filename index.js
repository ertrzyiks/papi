const express = require('express')
const { ApolloServer } = require('apollo-server-express')

const { typeDefs, resolvers, context } = require('./modules/food-time')

const app = express()

const server = new ApolloServer({ typeDefs, resolvers, context });

server.applyMiddleware({ app, path: '/food-time' })

app.listen(process.env.PORT || 8080, () => {
  console.log('Listening')
})
