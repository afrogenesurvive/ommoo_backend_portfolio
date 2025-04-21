
const authSchema = `
  

  type RegisterData {
    username: String!
    password: String!
    email: String!
    first_name: String
    last_name: String
    age: Int
    gender: String
    dob: String!
    response: String
    auth_type: String
  }

  type VerifyData {
    user_id: ID!
    type: String!
    code: String
    response: String
    auth_type: String
  }

  type PasswordResetData {
    email: String
    username: String
    code: String
    newPassword: String
    response: String
  }

  input LoginInput {
    username: String!
    password: String!
    auth_type: String!
  }

  input VerifyInput {
    username: String!
    email: String!
    code: String!
    type: String!
    auth_type: String
  }

  input PasswordResetInput {
    username: String!
    email: String!
    code: String
    newPassword: String
  }

  type AuthData {
    activityId: ID!
    token: String
    tokenExpiration: Int!
    error: String
    auth_type: String
  }
  
  input RegisterInput {
    username: String!
    first_name: String!
    last_name: String!
    dob: String!
    gender: String
    age: Int!
    password: String!
    email: String!
    auth_type: String!
  }


  type Query {
    login(loginInput: LoginInput!): AuthData!
    verify(verifyInput: VerifyInput!): VerifyData!
    requestPasswordReset(passwordResetInput: PasswordResetInput!): PasswordResetData!
    logout(id: ID!): String!
    resendVerifyEmail(username: String!, email: String!): String!
    resendPasswordResetEmail(username: String!, email: String!): String!
  }

  type Mutation {
    passwordReset(passwordResetInput: PasswordResetInput!): PasswordResetData!
    register(registerInput: RegisterInput!): VerifyData!
  }

  
`;

module.exports = authSchema;
