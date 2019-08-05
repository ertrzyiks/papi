const express = require('express')

const { ApolloServer, gql } = require('apollo-server-express')

const app = express()

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
    entry(spaceId: String!, id: String!): Entry
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
      spaceId: String!
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

const resolvers = {
  Query: {
    space: (_, {id}) => {
      return spaces[id]
    },
    entries: (_, {spaceId}) => {
      return entries.filter(entry => entry.spaceId === spaceId).sort((a, b) => b.time - a.time)
    },
    entry: (_, {spaceId, id}) => {
      return entries.filter(entry => entry.spaceId === spaceId && entry.id === id)[0]
    }
  },
  Mutation: {
    createEntry: async (_, {time, spaceId}) => {

      if (typeof spaces[spaceId] === 'undefined') {
        throw new Error('Unknown space')
      }

      const entry = {
        time,
        spaceId: spaceId,
        id: 'fake' + Math.random()
      }
      entries.push(entry)
      return entry
    },

    updateEntry: async (_, {time, spaceId, id}) => {

      if (typeof spaces[spaceId] === 'undefined') {
        throw new Error('Unknown space')
      }

      let entry = entries.find(entry => entry.spaceId === spaceId && entry.id === id)

      if (entry) {
        entry.time = time
      }

      return entry
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: '/food-time' })

app.listen(process.env.PORT || 8080, () => {
  console.log('Listening')
})
