const { gql } = require('apollo-server-express')

module.exports = gql`
  type Space {
    id: String!
    display_name: String!
  }
  
  type Entry {
    id: String!
    extra_food: Int!
    time: Int!
  }
  
  type DeletionResult {
    removedId: String!
    message: String!
  }
  
  type Query {
    spaces: [Space]
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
    
    removeEntry (
      id: String!
    ): DeletionResult
    
    updateEntry (
      id: String!
      time: Int 
      extra_food: Int 
    ): Entry
  }
`
