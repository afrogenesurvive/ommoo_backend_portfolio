
const showSchema = `
    type Show {
        id: ID!
        title: String!
        description: String
        production_company_id: ID
        age_recommendation: String
        duration: String
        start_date: String
        end_date: String
        type: String
        average_rating: Float
        display_image_url: String
        private: Boolean!
        create_time: String!
        update_time: String
        created_by: ID!
        updated_by: ID
        is_deleted: String!
        production_company: ProductionCompany
        show_users: [ShowUser]
        venue_shows: [VenueShow]
        venue_events: [VenueEvent]
        reviews: [Review]
        ratings: [Rating]
        tags: [Tag]
        likes: [Like]
        contacts: [Contact]
        files: [File]
    }

    input ShowInput {
        title: String
        description: String
        production_company_id: ID
        age_recommendation: String
        duration: String
        start_date: String
        end_date: String
        type: String
        average_rating: Float
        display_image_url: String
        private: Boolean
        create_time: String
        update_time: String
        created_by: String
        updated_by: String
    }

    type Query {
        getAllShows(args: String): [Show]
        getAllPublicShows(args: String): [Show]
        getShow(id: ID!): Show
        getShowByQuery(args: String!): [Show]
    }

    type Mutation {
        createShow(showInput: ShowInput!): Show
        updateShow(id: ID!, showInput: ShowInput!): Show
        deleteShow(id: ID!): Show
    }

`;

module.exports = showSchema;