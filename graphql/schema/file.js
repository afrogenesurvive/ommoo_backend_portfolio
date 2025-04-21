
const fileSchema = `
  type File {
    id: ID!
    entity_type: String!
    entity_id: ID!
    type: String
    filename: String!
    filetype: String!
    url: String!
    path: String!
    size: Float
    private: Boolean
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
    watchlistItem: WatchlistItem
    awsUploadUrl: String
    awsDownloadUrl: String
  }

  type getUploadUrlResponse {
    upload_url: String
    signed_download_url: String
    direct_download_url: String
  }
  
  type getDownloadUrlResponse {
    signed_download_url: String
    direct_download_url: String
  }

  input FileInput {
    entity_type: String!
    entity_id: ID!
    type: String
    filename: String!
    filetype: String
    url: String
    path: String
    size: Float
    private: Boolean
    create_time: String
    update_time: String
    created_by: String
    updated_by: String
    newUrl: Boolean
  }
  
  input StorePresignedUrlInput {
    filename: String
    private: Boolean
  }
  

  type Query {
    getAllFiles(args: String): [File]
    getFile(id: ID!): File
    getFileByQuery(args: String!): [File]
    getUploadPresignedUrl(args: StorePresignedUrlInput): getUploadUrlResponse
    getDownloadPresignedUrl(args: StorePresignedUrlInput): getDownloadUrlResponse
  }

  type Mutation {
    createFile(fileInput: FileInput!): File
    updateFile(id: ID!, fileInput: FileInput!): File
    deleteFile(id: ID!): File
  }

`;

module.exports = fileSchema;