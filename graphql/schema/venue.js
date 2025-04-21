
const venueSchema = `
  type Venue {
    id: ID!
    name: String!
    description: String
    type: String
    accessibility: String
    display_image_url: String
    private: Boolean!
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
    is_deleted: String!
    contacts: [Contact]
    venue_users: [VenueUser]
    venue_shows: [VenueShow]
    venue_events: [VenueEvent]
    reviews: [Review]
    ratings: [Rating]
    tags: [Tag]
    likes: [Like]
    files: [File]
  }

  input VenueInput {
    name: String
    description: String
    type: String
    accessibility: String
    display_image_url: String
    private: Boolean
    create_time: String
    update_time: String
    created_by: String
    updated_by: String
  }

  type Query {
    getAllVenues(args: String): [Venue]
    getVenue(id: ID!): Venue
    getVenueByQuery(args: String!): [Venue]
  }

  type Mutation {
    createVenue(venueInput: VenueInput!): Venue
    updateVenue(id: ID!, venueInput: VenueInput!): Venue
    deleteVenue(id: ID!): Venue
  }

`;

module.exports = venueSchema;