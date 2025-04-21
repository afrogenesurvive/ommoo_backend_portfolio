
const eventSchema = `
  type Event {
    id: ID!
    name: String!
    description: String
    type: String
    start_date: String
    end_date: String
    display_image_url: String
    private: Boolean!
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
    is_deleted: String!
    contacts: [Contact]
    venue_events: [VenueEvent]
    reviews: [Review]
    ratings: [Rating]
    tags: [Tag]
    likes: [Like]
    files: [File]
  }

  input EventInput {
    name: String
    description: String
    type: String
    start_date: String
    end_date: String
    display_image_url: String
    private: Boolean
    create_time: String
    update_time: String
    created_by: String
    updated_by: String
  }

  type Query {
    getAllEvents(args: String): [Event]
    getEvent(id: ID!): Event
    getEventByQuery(args: String!): [Event]
  }

  type Mutation {
    createEvent(eventInput: EventInput!): Event
    updateEvent(id: ID!, eventInput: EventInput!): Event
    deleteEvent(id: ID!): Event
  }

`;

module.exports = eventSchema;