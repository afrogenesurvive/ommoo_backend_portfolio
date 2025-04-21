
const tagSchema = `
  type Tag {
    id: ID!
    entity_type: String!
    entity_id: ID!
    tag: String!
    private: Boolean!
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
    is_deleted: String!
    user: User
    production_company: ProductionCompany
    venue: Venue
    show: Show
    event: Event
    review: Review
    watchlist: Watchlist
  }

  input TagInput {
    entity_type: String!
    entity_id: ID!
    tag: String
    private: Boolean
    create_time: String
    update_time: String
    created_by: String
    updated_by: String
  }

  type Query {
    getAllTags(args: String): [Tag]
    getTag(id: ID!): Tag
    getTagByQuery(args: String!): [Tag]
  }

  type Mutation {
    createTag(tagInput: TagInput!): Tag
    updateTag(id: ID!, tagInput: TagInput!): Tag
    deleteTag(id: ID!): Tag
  }

`;

module.exports = tagSchema;