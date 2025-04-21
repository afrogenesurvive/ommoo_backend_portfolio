const likeSchema = `
  type Like {
    id: ID!
    entity_type: String!
    entity_id: ID!
    value: Int!
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

  input LikeInput {
    entity_type: String!
    entity_id: ID!
    value: Int!
    private: Boolean
    create_time: String
    update_time: String
    created_by: ID
    updated_by: ID
    is_deleted: String
  }

  type Query {
    getAllLikes(args: String): [Like]
    getLike(id: ID!): Like
    getLikeByQuery(args: String!): [Like]
  }

  type Mutation {
    createLike(likeInput: LikeInput!): Like
    updateLike(id: ID!, likeInput: LikeInput!): Like
    deleteLike(id: ID!): Like
  }
`;

module.exports = likeSchema;