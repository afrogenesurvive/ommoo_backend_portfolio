
const ShowUserSchema = `
  type ShowUser {
    id: ID!
    show_id: ID!
    show: Show
    user_id: ID!
    user: User
    attendance_type: String!
    venue_show_id: ID!
    venue_show: VenueShow
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
    is_deleted: String!
  }

  input ShowUserInput {
    show_id: ID!
    user_id: ID!
    venue_show_id: ID!
    attendance_type: String
    create_time: String
    update_time: String
    created_by: String
    updated_by: String
  }

  type Query {
    getAllShowUsers(args: String): [ShowUser]
    getShowUser(id: ID!): ShowUser
    getShowUserByQuery(args: String!): [ShowUser]
  }

  type Mutation {
    createShowUser(showUserInput: ShowUserInput!): ShowUser
    updateShowUser(id: ID!, showUserInput: ShowUserInput!): ShowUser
    deleteShowUser(id: ID!): ShowUser
  }

`;

module.exports = ShowUserSchema;