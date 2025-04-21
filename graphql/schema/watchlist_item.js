const watchlistItemSchema = `
  type WatchlistItem {
    id: ID!
    watchlist_id: ID!
    show_id: ID!
    position: Int!
    private: Boolean!
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
    is_deleted: String!
    watchlist: Watchlist
    show: Show
  }

  input WatchlistItemInput {
    watchlist_id: ID!
    show_id: ID!
    position: Int!
    private: Boolean
    create_time: String
    update_time: String
    created_by: ID
    updated_by: ID
    is_deleted: String
  }

  type Query {
    getAllWatchlistItems(args: String): [WatchlistItem]
    getWatchlistItem(id: ID!): WatchlistItem
    getWatchlistItemByQuery(args: String!): [WatchlistItem]
  }

  type Mutation {
    createWatchlistItem(watchlistItemInput: WatchlistItemInput!): WatchlistItem
    updateWatchlistItem(id: ID!, watchlistItemInput: WatchlistItemInput!): WatchlistItem
    deleteWatchlistItem(id: ID! watchlist_id: ID!): WatchlistItem
  }
`;

module.exports = watchlistItemSchema;