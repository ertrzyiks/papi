const { gql } = require('apollo-server-express')

module.exports = gql`
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
`
