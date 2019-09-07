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
    spaceId: String!
    type: String! 
    vitamin: Boolean!
    source: String
  }
  
  type DeletionResult {
    removedId: String!
    message: String!
  }
  
  type Query {
    spaces: [Space]
    entries(spaceId: String!): [Entry]
    lastEntryDate(spaceId: String!): String
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
      type: String
      vitamin: Boolean
      source: String
    ): Entry
  }
`
