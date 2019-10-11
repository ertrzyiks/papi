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
    feeding_duration: Int
  }
  
  type DeletionResult {
    removedId: String!
    message: String!
  }
  
  type ExtraFoodPerDayStat {
    date: String!
    extra_food: Int!
  }
  
  type FeedingCountPerDayStat {
    date: String!
    feeding_count: Int!
  }
  
  type NightBreakDurationStat {
    date: String!
    firstBreakDurationInMins: Int
    secondBreakDurationInMins: Int  
  }
  
  type AverageDayBreakDurationStat {
    date: String!
    average_duration_mins: Int
  }
  
  type Stats {
    extra_food_per_day: [ExtraFoodPerDayStat]
    feeding_count_per_day: [FeedingCountPerDayStat]
    night_breaks: [NightBreakDurationStat]
    average_day_break: [AverageDayBreakDurationStat]
  }
  
  type Query {
    spaces: [Space]
    entries(spaceId: String!): [Entry]
    lastEntryDate(spaceId: String!): String
    now: String
    entry(id: String!): Entry
    stats(spaceId: String!): Stats!
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
      feeding_duration: Int
    ): Entry
  }
`
