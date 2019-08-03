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

let id = 1
let spaces = [{
  name: "Test",
  id: "0"
},{
  name: "Test 2",
  id: "1"
}]

let entries = [
  {
    id: '1',
    time: 0,
    spaceId: "1"
  }
]

const resolvers = {
  Query: {
    space: (_, {id}) => {
      return spaces[parseInt(id, 10)]
    },
    entries: (_, {spaceId}) => {
      return entries.filter(entry => entry.spaceId === spaceId).sort((a, b) => b.time - a.time)
    }
  },
  Mutation: {
    createSpace: async (_, {name}) => {
      const space = {
        name,
        id: ++id
      }
      spaces.push(space)
      return space
    },
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
