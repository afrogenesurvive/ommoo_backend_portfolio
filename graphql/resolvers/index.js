const authResolver = require('./auth');
const userResolver = require('./user');
const contactResolver = require('./contact');
const eventResolver = require('./event');
const venueResolver = require('./venue');
const showResolver = require('./show');
const production_companyResolver = require('./production_company');
const production_company_userResolver = require('./production_company_user');
const ratingResolver = require('./rating');
const reviewResolver = require('./review');
const tagResolver = require('./tag');
const likeResolver = require('./like');
const watchlistResolver = require('./watchlist');
const watchlist_itemResolver = require('./watchlist_item');
const show_userResolver = require('./show_user');
const venue_userResolver = require('./venue_user');
const venue_showResolver = require('./venue_show');
const venue_eventResolver = require('./venue_event');
const activityResolver = require('./activity');
const fileResolver = require('./file');
const searchResolver = require('./search');


const rootResolver = {
  Query: {
    ...authResolver.Query,
    ...userResolver.Query,
    ...contactResolver.Query,
    ...eventResolver.Query,
    ...venueResolver.Query,
    ...showResolver.Query,
    ...production_companyResolver.Query,
    ...production_company_userResolver.Query,
    ...ratingResolver.Query,
    ...reviewResolver.Query,
    ...tagResolver.Query,
    ...likeResolver.Query,
    ...watchlistResolver.Query,
    ...watchlist_itemResolver.Query,
    ...show_userResolver.Query,
    ...venue_userResolver.Query,
    ...venue_showResolver.Query,
    ...venue_eventResolver.Query,
    ...activityResolver.Query,
    ...fileResolver.Query,
    ...searchResolver.Query,
  },
  Mutation: {
    ...authResolver.Mutation,
    ...userResolver.Mutation,
    ...contactResolver.Mutation,
    ...eventResolver.Mutation,
    ...venueResolver.Mutation,
    ...showResolver.Mutation,
    ...production_companyResolver.Mutation,
    ...production_company_userResolver.Mutation,
    ...ratingResolver.Mutation,
    ...reviewResolver.Mutation,
    ...tagResolver.Mutation,
    ...likeResolver.Mutation,
    ...watchlistResolver.Mutation,
    ...watchlist_itemResolver.Mutation,
    ...show_userResolver.Mutation,
    ...venue_userResolver.Mutation,
    ...venue_showResolver.Mutation,
    ...venue_eventResolver.Mutation,
    ...fileResolver.Mutation,
  }
};

module.exports = rootResolver;
