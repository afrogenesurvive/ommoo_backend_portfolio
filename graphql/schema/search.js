
const searchSchema = `

  type SearchResult {
    label: String
    value: [SearchEntity!]!
  }

  union SearchEntity = 
    Show | 
    Event | 
    User | 
    ProductionCompany |
    Contact |
    Tag | 
    Review | 
    Rating | 
    Like | 
    Watchlist | 
    WatchlistItem | 
    Venue
    

  type SearchData {
    users: [User]
    shows: [Show]
    events: [Event]
    productionCompanies: [ProductionCompany]
    tags: [Tag]
    reviews: [Review]
    ratings: [Rating]
    likes: [Like]
    watchlists: [Watchlist]
    watchlistItems: [WatchlistItem]
    venues: [Venue]
  }

  type SearchResponse {
    entities: [SearchEntity]
    data: SearchData
  }

  input CustomSearchFieldInput {
    entity: String
    field: String
  }
  
  input CustomSearchSubfieldInput {
    entity: String
    associated_entity: String
    field: String
    value: String
  }
  
  input SearchInput {
    term: String!
    format: String
    userType: String!
    useCustomFields: Boolean!
    customFields: [CustomSearchFieldInput]
    useCustomSubfields: Boolean!
    customSubfields: [CustomSearchSubfieldInput]
  }

  type Query {
    search(searchInput: SearchInput!): SearchResponse
  }

`;

module.exports = searchSchema;





