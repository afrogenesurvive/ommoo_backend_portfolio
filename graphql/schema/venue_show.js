
const venueShowSchema = `
  type VenueShow {
    id: ID!
    show_id: ID!
    show: Show
    venue_id: ID!
    venue: Venue
    event_id: ID!
    event: Event
    venue_event_id: ID
    venue_event: VenueEvent
    type: String
    name: String
    description: String
    date: String!
    start_time: String!
    end_time: String
    active: Boolean
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
    is_deleted: String!
  }

  input VenueShowInput {
    show_id: ID
    venue_id: ID
    event_id: ID
    venue_event_id: ID
    type: String
    name: String
    description: String
    date: String
    start_time: String
    end_time: String
    active: Boolean
    create_time: String
    update_time: String
    created_by: String
    updated_by: String
  }

  type Query {
    getAllVenueShows(args: String): [VenueShow]
    getVenueShow(id: ID!): VenueShow
    getVenueShowByQuery(args: String!): [VenueShow]
  }

  type Mutation {
    createVenueShow(venueShowInput: VenueShowInput!): VenueShow
    updateVenueShow(id: ID!, venueShowInput: VenueShowInput!): VenueShow
    deleteVenueShow(id: ID!): VenueShow
  }

`;

module.exports = venueShowSchema;