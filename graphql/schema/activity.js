
const userSchema = `

  type Activity {
    id: ID!
    user_id: ID!
    user: User
    request: String!
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
    is_deleted: String!
  }


  type Query {
    getAllActivity(args: String): [Activity]
    getUserActivity(user_id: ID!): Activity
    getActivityByQuery(args: String!): Activity
  }

  
`;

module.exports = userSchema;
