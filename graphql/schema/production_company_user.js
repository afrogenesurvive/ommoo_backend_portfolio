
const productionCompanySchema = `
  type ProductionCompanyUser {
    id: ID!
    user_id: ID!
    user: User
    production_company_id: ID!
    production_company: ProductionCompany
    role: String
    private: Boolean!
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
    is_deleted: String!
  }

  input ProductionCompanyUserInput {
    user_id: ID!
    production_company_id: ID!
    role: String
    private: Boolean
    create_time: String
    update_time: String
    created_by: String
    updated_by: String
  }

  type Query {
    getAllProductionCompanyUsers(args: String): [ProductionCompanyUser]
    getProductionCompanyUser(id: ID!): ProductionCompanyUser
    getProductionCompanyUserByQuery(args: String!): [ProductionCompanyUser]
  }

  type Mutation {
    createProductionCompanyUser(productionCompanyUserInput: ProductionCompanyUserInput!): ProductionCompanyUser
    updateProductionCompanyUser(id: ID!, productionCompanyUserInput: ProductionCompanyUserInput!): ProductionCompanyUser
    deleteProductionCompanyUser(id: ID!): ProductionCompanyUser
  }

`;

module.exports = productionCompanySchema;