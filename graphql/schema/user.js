
const userSchema = `
  type User {
    id: ID!
    username: String!
    first_name: String!
    last_name: String!
    middle_name: String
    full_name: String
    email: String
    type: String
    subtype: String
    dob: String!
    age: Int!
    gender: String
    password: String!
    system_id: String
    notes: String
    role: String
    logged_in: Boolean
    activity: [Activity]
    verified: Boolean
    verification_code: String
    verification_type: String
    reset_code: String
    display_image_url: String
    private: Boolean!
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
    is_deleted: String!
    contacts: [Contact]
    user_permissions: [Permission]
    show_users: [ShowUser]
    venue_users: [VenueUser]
    reviews: [Review]
    ratings: [Rating]
    tags: [Tag]
    likes: [Like]
    watchlists: [Watchlist]
    files: [File]
  }

  input UserInput {
    username: String
    first_name: String
    last_name: String
    middle_name: String
    full_name: String
    email: String
    type: String
    subtype: String
    dob: String
    age: Int
    gender: String
    password: String
    system_id: String
    notes: String
    role: String
    logged_in: Boolean
    verified: Boolean
    verification_code: String
    verification_type: String
    reset_code: String
    display_image_url: String
    private: Boolean
    create_time: String
    update_time: String
    created_by: String
    updated_by: String
  }
  
  type Permission {
    id: ID!
    user_id: ID!
    name: String!
    entity_id: ID
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
  }

  type Query {
    getAllUsers(args: String): [User]
    getUser(id: ID!): User
    getUserByQuery(args: String!): [User]
  }

  type Mutation {
    createUser(userInput: UserInput!): User
    updateUser(id: ID!, userInput: UserInput!): User
    deleteUser(id: ID!): User
  }

  
`;

module.exports = userSchema;
