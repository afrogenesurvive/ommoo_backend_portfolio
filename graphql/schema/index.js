const { mergeTypeDefs } = require('@graphql-tools/merge');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const authSchema = require('./auth');
const userSchema = require('./user');
const contactSchema = require('./contact');
const eventSchema = require('./event');
const venueSchema = require('./venue');
const showSchema = require('./show');
const venueEventSchema = require('./venue_event');
const venueShowSchema = require('./venue_show');
const venueUserSchema = require('./venue_user');
const showUserSchema = require('./show_user');
const productionCompanySchema = require('./production_company');
const productionCompanyUserSchema = require('./production_company_user');
const ratingSchema = require('./rating');
const reviewSchema = require('./review');
const tagSchema = require('./tag');
const likeSchema = require('./like');
const watchlistSchema = require('./watchlist');
const watchlistItemSchema = require('./watchlist_item');
const activitySchema = require('./activity');
const fileSchema = require('./file');
const searchSchema = require('./search')


const typeDefs = mergeTypeDefs([
    authSchema,
    userSchema,
    contactSchema,
    eventSchema,
    venueSchema,
    showSchema,
    venueEventSchema,
    venueShowSchema,
    venueUserSchema,
    showUserSchema,
    productionCompanySchema,
    productionCompanyUserSchema,
    ratingSchema,
    reviewSchema,
    tagSchema,
    likeSchema,
    watchlistSchema,
    watchlistItemSchema,
    activitySchema,
    fileSchema,
    searchSchema,
]);

// module.exports = typeDefs;
const resolvers = require('../resolvers'); // Assuming you have an index.js in resolvers folder that exports all resolvers


const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

module.exports = schema;