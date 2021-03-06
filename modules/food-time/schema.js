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
  
  type ActivityLogEntry {
    id: String!
    time: Int!
    message: String!
    spaceId: String!
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
  
  type ExtraFoodPerWeekStat {
    week_start_date: String!
    extra_food: Int!
  }
  
  type FeedingCountPerWeekStat {
    week_start_date: String!
    feeding_count: Int!
  }
  
  type AggregatedStats {
    extra_food_per_week: [ExtraFoodPerWeekStat]
    feeding_count_per_week: [FeedingCountPerWeekStat]
  }
  
  type Query {
    spaces: [Space]
    entries(spaceId: String!): [Entry]
    activity_log(spaceId: String!): [ActivityLogEntry]
    lastEntryDate(spaceId: String!): String
    now: String
    entry(id: String!): Entry
    activity_log_entry(id: String!): ActivityLogEntry
    stats(spaceId: String!, daysAgo: Int!): Stats!
    aggregated_stats(spaceId: String!): AggregatedStats!
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
    
    createActivityLogEntry (
      spaceId: String!
      time: Int!  
      message: String!
    ): ActivityLogEntry
    
    removeActivityLogEntry (
      id: String!
    ): DeletionResult
  }
`
