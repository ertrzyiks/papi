const express = require('express')

const { ApolloServer, gql } = require('apollo-server-express')

const app = express()
const uuid = require('uuid')

const typeDefs = gql`
  type Space {
    id: String!
    name: String!
  }
  
  type Entry {
    id: String!
    time: Int!
  }
  
  type Query {
    space(id: String!): Space
    entries(spaceId: String!): [Entry]
    entry(id: String!): Entry
  }
    
  type Mutation {
    createSpace (
      name: String!
    ): Space
    
    createEntry (
      spaceId: String!
      time: Int!  
    ): Entry
    
    updateEntry (
      id: String!
      time: Int!  
    ): Entry
  }
`;

let spaces = {
  kuba: {
    name: 'Kuba'
  }
}

let entries = [
  {
    id: '1',
    time: 0,
    spaceId: "kuba"
  }
]

var knex = require('./knex')

const resolvers = {
  Query: {
    space: (_, {id}) => {
      return spaces[id]
    },
    entries: (_, {spaceId}) => {
      return knex.select('id', 'time', 'extra_food')
        .from('entries')
        .orderBy('time', 'desc')
        .where({spaceId})
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
      if (typeof spaces[spaceId] === 'undefined') {
        throw new Error('Unknown space')
      }

      const id = uuid.v4()
      const entry = {id, time, extra_food: 0, spaceId}

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

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: '/food-time' })

app.listen(process.env.PORT || 8080, () => {
  console.log('Listening')
})
