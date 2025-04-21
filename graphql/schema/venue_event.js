
const venueEventSchema = `
  type VenueEvent {
    id: ID!
    venue_id: ID!
    venue: Venue
    event_id: ID!
    event: Event
    show_id: ID
    show: Show
    active: Boolean
    name: String
    type: String
    description: String
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
    is_deleted: String!
  }

  input VenueEventInput {
    venue_id: ID
    event_id: ID
    show_id: ID
    active: Boolean
    name: String
    type: String
    description: String
    create_time: String
    update_time: String
    created_by: String
    updated_by: String
  }

  type Query {
    getAllVenueEvents(args: String): [VenueEvent]
    getVenueEvent(id: ID!): VenueEvent
    getVenueEventByQuery(args: String!): [VenueEvent]
  }

  type Mutation {
    createVenueEvent(venueEventInput: VenueEventInput!): VenueEvent
    updateVenueEvent(id: ID!, venueEventInput: VenueEventInput!): VenueEvent
    deleteVenueEvent(id: ID!): VenueEvent
  }

`;

module.exports = venueEventSchema;