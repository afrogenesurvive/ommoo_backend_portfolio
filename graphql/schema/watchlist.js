const watchlistSchema = `
  type Watchlist {
    id: ID!
    user_id: ID!
    name: String!
    description: String
    display_image_url: String
    private: Boolean!
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
    is_deleted: String!
    user: User
    watchlist_items: [WatchlistItem]
    tags: [Tag]
    likes: [Like]
  }

  input WatchlistInput {
    user_id: ID!
    name: String!
    description: String
    display_image_url: String
    private: Boolean
    create_time: String
    update_time: String
    created_by: ID
    updated_by: ID
    is_deleted: String
  }

  type Query {
    getAllWatchlists(args: String): [Watchlist]
    getWatchlist(id: ID!): Watchlist
    getWatchlistByQuery(args: String!): [Watchlist]
  }

  type Mutation {
    createWatchlist(watchlistInput: WatchlistInput!): Watchlist
    updateWatchlist(id: ID!, watchlistInput: WatchlistInput!): Watchlist
    deleteWatchlist(id: ID!): Watchlist
  }
`;

module.exports = watchlistSchema;