
const reviewSchema = `
  type Review {
    id: ID!
    user_id: ID!
    user: User
    show_id: ID!
    show: Show
    venue_id: ID
    venue: Venue
    event_id: ID
    event: Event
    show_user_id: ID!
    show_user: ShowUser
    venue_show_id: ID!
    venue_show: VenueShow
    type: String
    review: String!
    display_image_url: String
    held: Boolean
    private: Boolean!
    create_time: String!
    update_time: String
    created_by: ID!
    updated_by: ID
    is_deleted: String!
    ratings: [Rating]
    tags: [Tag]
    likes: [Like]
  }

  input ReviewInput {
    user_id: ID
    show_id: ID
    venue_id: ID
    event_id: ID
    show_user_id: ID!
    venue_show_id: ID!
    type: String
    review: String
    display_image_url: String
    held: Boolean
    private: Boolean!
    create_time: String
    update_time: String
    created_by: String
    updated_by: String
  }
  
  input GuestReviewInput {
    user_id: ID
    show_id: ID
    venue_id: ID
    event_id: ID
    venue_show_id: ID
    review: String
  }

  type Query {
    getAllReviews(args: String): [Review]
    getReview(id: ID!): Review
    getReviewByQuery(args: String!): [Review]
  }

  type Mutation {
    createReview(reviewInput: ReviewInput!): Review
    createGuestReview(reviewInput: GuestReviewInput!): Review
    updateReview(id: ID!, reviewInput: ReviewInput!): Review
    deleteReview(id: ID!): Review
    setReviewHold(id: ID!, state: Boolean!): Review
  }

`;

module.exports = reviewSchema;