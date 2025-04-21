
const ratingSchema = `
  type Rating {
    id: ID!
    user_id: ID!
    user: User
    show_id: ID!
    show: Show
    venue_id: ID
    venue: Venue
    event_id: ID
    event: Event
    show_user_id: ID
    show_user: ShowUser
    venue_show_id: ID
    venue_show: VenueShow
    review_id: ID
    review: Review
    type: String
    value: Int!
    held: Boolean
    private: Boolean!
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
    is_deleted: String!
  }

  input RatingInput {
    user_id: ID
    show_id: ID
    venue_id: ID
    event_id: ID
    review_id: ID
    show_user_id: ID!
    venue_show_id: ID!
    type: String
    value: Int
    held: Boolean
    private: Boolean!
    create_time: String
    update_time: String
    created_by: String
    updated_by: String
  }
  
  input GuestRatingInput {
    user_id: ID
    show_id: ID
    venue_id: ID
    event_id: ID
    review_id: ID
    venue_show_id: ID
    value: Int
  }

  type Query {
    getAllRatings(args: String): [Rating]
    getRating(id: ID!): Rating
    getRatingByQuery(args: String!): [Rating]
  }

  type Mutation {
    createRating(ratingInput: RatingInput!): Rating
    createGuestRating(ratingInput: GuestRatingInput!): Rating
    updateRating(id: ID!, ratingInput: RatingInput!): Rating
    deleteRating(id: ID!): Rating
    setRatingHold(id: ID!, state: Boolean!): Rating
  }

`;

module.exports = ratingSchema;
