
const productionCompanySchema = `
  type ProductionCompany {
    id: ID!
    name: String!
    description: String
    founded: String
    type: String
    display_image_url: String
    private: Boolean!
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
    is_deleted: String!
    production_company_user: [ProductionCompanyUser]
    contacts: [Contact]
    shows: [Show]
    tags: [Tag]
    likes: [Like]
    files: [File]
  }

  input ProductionCompanyInput {
    name: String
    description: String
    founded: String
    type: String
    display_image_url: String
    private: Boolean
    create_time: String
    update_time: String
    created_by: String
    updated_by: String
  }

  type Query {
    getAllProductionCompanies(args: String): [ProductionCompany]
    getProductionCompany(id: ID!): ProductionCompany
    getProductionCompanyByQuery(args: String!): [ProductionCompany]
  }

  type Mutation {
    createProductionCompany(productionCompanyInput: ProductionCompanyInput!): ProductionCompany
    updateProductionCompany(id: ID!, productionCompanyInput: ProductionCompanyInput!): ProductionCompany
    deleteProductionCompany(id: ID!): ProductionCompany
  }

`;

module.exports = productionCompanySchema;