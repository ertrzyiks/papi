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
  }
    
  type Mutation {
    createSpace (
      name: String!
    ): Space
    
    createEntry (
      spaceId: String!
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
    }
  },
  Mutation: {
    createEntry: async (_, {time, spaceId}) => {
      const entry = {
        time,
        spaceId: spaceId,
        id: 'fake' + Math.random()
      }
      entries.push(entry)
      return entry
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app, path: '/food-time' })

app.listen(process.env.PORT || 8080, () => {
  console.log('Listening')
})
