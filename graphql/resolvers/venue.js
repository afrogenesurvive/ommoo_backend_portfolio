const moment = require('moment-timezone');
const { 
    user,
    production_company,
    production_company_user,
    contact, 
    user_permission, 
    show_user, 
    venue_user, 
    show, 
    venue,
    event,
    review,
    rating,
    tag,
    like,
    watchlist,
    watchlist_item,
    venue_event,
    venue_show,
    activity,
    file,
} = require('../../db/models'); 
const { Op } = require('sequelize');


const { addUserActivity, canEditExistingEntity } = require('../../middleware/utils/utils');

module.exports = {
    Query: {
        getAllVenues: async (_, {args}, { req }) => {
            console.log("Resolver: getAllVenues...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const query = JSON.parse(args);
            let include = [];
            let where_like = [];
            let where = { is_deleted: 'N' };

            query.includes.forEach(incl => {
                switch (incl) {
                case 'contact':
                    include.push({ 
                    model: contact, 
                    as: 'contacts', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'venue_user':
                    include.push({ 
                    mode: venue_user, 
                    as: 'venue_users', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [{
                        model: user, 
                        as: 'user', 
                        foreignKey: 'user_id',
                        where: { is_deleted: 'N' },
                        required: false,
                      }]
                    });
                    break;
                case 'venue_show':
                    include.push({ 
                    model: venue_show, 
                    as: 'venue_shows', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [{
                        model: show, 
                        as: 'show', 
                        foreignKey: 'show_id',
                        where: { is_deleted: 'N' },
                        required: false,
                      }]
                    });
                    break;
                case 'venue_event':
                    include.push({ 
                    model: venue_event, 
                    as: 'venue_events', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [{
                        model: event, 
                        as: 'event', 
                        foreignKey: 'event_id',
                        where: { is_deleted: 'N' },
                        required: false,
                      }]
                    });
                    break;
                case 'review':
                    include.push({ 
                    model: review, 
                    as: 'reviews', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'rating':
                    include.push({ 
                    model: rating, 
                    as: 'ratings', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'tag':
                    include.push({ 
                    model: tag, 
                    as: 'tags', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'like':
                    include.push({ 
                        model: like, 
                        as: 'likes', 
                        foreignKey: 'entity_id', 
                        where: { is_deleted: 'N' }, 
                        required: false 
                    });
                    break;
                case 'file':
                    include.push({ 
                        model: file, 
                        as: 'files', 
                        foreignKey: 'entity_id', 
                        where: { is_deleted: 'N' }, 
                        required: false 
                    });
                    break;
                default:
                    break;
                }
            });

            query.where_like?.forEach(whl => {
                // where_like.push({[whl.key]: { [Op.like]: `%${whl.value}%` }});
                where[whl.key] = { [Op.like]: `%${whl.value}%` }
            });

            query.where?.forEach(wh => {
                where[wh.key] = wh.value;
            });

            query.where_in_like?.forEach(whi => {
                where[Op.or] = whi.values.map(value => ({
                    [whi.key]: { [Op.like]: `%${value}%` }, // Use LIKE for each value
                }));
            });

            query.where_in?.forEach(whi => {
                where[whi.key] = { [Op.in]: whi.values }; 
            });

            const venues = await venue.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getAllVenues',
            });

            return venues.map(venue => {
                return {
                ...venue.dataValues,
                _id: venue.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
        getVenue: async (_, { id }, { req }) => {
            console.log("Resolver: getVenueById...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const venue_ = await venue.findOne({
                where: { 
                    id: id,
                    is_deleted: 'N' 
                },
                include: [
                { 
                    model: contact, 
                    as: 'contacts', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: venue_user, 
                    as: 'venue_users', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [{
                        model: user, 
                        as: 'user', 
                        foreignKey: 'user_id',
                        where: { is_deleted: 'N' },
                        required: false,
                    }]
                },
                { 
                    model: venue_show, 
                    as: 'venue_shows', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [{
                        model: show, 
                        as: 'show', 
                        foreignKey: 'show_id',
                        where: { is_deleted: 'N' },
                        required: false,
                    }]
                },
                { 
                    model: venue_event, 
                    as: 'venue_events', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [{
                        model: event, 
                        as: 'event', 
                        foreignKey: 'event_id',
                        where: { is_deleted: 'N' },
                        required: false,
                      }]
                },
                { 
                    model: review, 
                    as: 'reviews', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: rating, 
                    as: 'ratings', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: tag, 
                    as: 'tags', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: like, 
                    as: 'likes', 
                    foreignKey: 'entity_id', 
                    where: { is_deleted: 'N' }, 
                    required: false 
                },
                { 
                    model: file, 
                    as: 'files', 
                    foreignKey: 'entity_id', 
                    where: { is_deleted: 'N' }, 
                    required: false 
                }
                ]
            });
            if (!venue_) {
                throw new Error('Venue not found');
            }

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getVenue',
            });

            return {
                ...venue_.dataValues,
                _id: venue_.id
            };
            } catch (err) {
            throw err;
            }
        },
        getVenueByQuery: async (_, {args}, { req }) => {
            console.log("Resolver: getVenueByQuery...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const query = JSON.parse(args);
            let include = [];
            let where_like = [];
            let where = { is_deleted: 'N' };

            query.includes.forEach(incl => {
                switch (incl) {
                case 'contact':
                    include.push({ 
                    model: contact, 
                    as: 'contacts', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'venue_user':
                    include.push({ 
                    mode: venue_user, 
                    as: 'venue_users', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [{
                        model: user, 
                        as: 'user', 
                        foreignKey: 'user_id',
                        where: { is_deleted: 'N' },
                        required: false,
                      }]
                    });
                    break;
                case 'venue_show':
                    include.push({ 
                    model: venue_show, 
                    as: 'venue_shows', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [{
                        model: show, 
                        as: 'show', 
                        foreignKey: 'show_id',
                        where: { is_deleted: 'N' },
                        required: false,
                      }]
                    });
                    break;
                case 'venue_event':
                    include.push({ 
                    model: venue_event, 
                    as: 'venue_events', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [{
                        model: event, 
                        as: 'event', 
                        foreignKey: 'event_id',
                        where: { is_deleted: 'N' },
                        required: false,
                      }]
                    });
                    break;
                case 'review':
                    include.push({ 
                    model: review, 
                    as: 'reviews', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'rating':
                    include.push({ 
                    model: rating, 
                    as: 'ratings', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'tag':
                    include.push({ 
                    model: tag, 
                    as: 'tags', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'like':
                    include.push({ 
                        model: like, 
                        as: 'likes', 
                        foreignKey: 'entity_id', 
                        where: { is_deleted: 'N' }, 
                        required: false 
                    });
                    break;
                case 'file':
                    include.push({ 
                        model: file, 
                        as: 'files', 
                        foreignKey: 'entity_id', 
                        where: { is_deleted: 'N' }, 
                        required: false 
                    });
                    break;
                default:
                    break;
                }
            });

            query.where_like?.forEach(whl => {
                // where_like.push({[whl.key]: { [Op.like]: `%${whl.value}%` }});
                where[whl.key] = { [Op.like]: `%${whl.value}%` }
            });

            query.where?.forEach(wh => {
                where[wh.key] = wh.value;
            });

            query.where_in_like?.forEach(whi => {
                where[Op.or] = whi.values.map(value => ({
                    [whi.key]: { [Op.like]: `%${value}%` }, // Use LIKE for each value
                }));
            });

            query.where_in?.forEach(whi => {
                where[whi.key] = { [Op.in]: whi.values }; 
            });

            const venues = await venue.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getVenueByQuery',
            });

            return venues.map(venue => {
                return {
                ...venue.dataValues,
                _id: venue.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
    },
    Mutation: {
        createVenue: async (_, { venueInput }, { req }) => {
            console.log("Resolver: createVenue...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const venue_ = await venue.create({
                ...venueInput,
                create_time: moment().format(),
                created_by: req.raw.user.id,
                is_deleted: 'N'
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'createVenue',
            });

            return {
                ...venue_.dataValues,
                _id: venue_.id
            };
            } catch (err) {
            throw err;
            }
        },
        updateVenue: async (_, { id, venueInput }, { req }) => {
            console.log("Resolver: updateVenue...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const access = await canEditExistingEntity(req, {
                    entity_type: 'venue',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

                const venue_ = await venue.findOne({
                    where: { 
                    id: id,
                    is_deleted: 'N'
                    }
                });
                await venue_.update({
                    ...venueInput,
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'updateVenue',
                });

                return {
                    ...venue_.dataValues,
                    _id: venue_.id
                };
            } catch (err) {
            throw err;
            }
        },
        deleteVenue: async (_, { id }, { req }) => {
            console.log("Resolver: deleteVenue...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const access = await canEditExistingEntity(req, {
                    entity_type: 'venue',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

                const venue_ = await venue.findOne({ where: { id: id } });
                await venue_.update({
                    is_deleted: 'Y',
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'deleteVenue',
                });

                return {
                    ...venue_.dataValues,
                    _id: venue_.id
                };
            } catch (err) {
            throw err;
            }
        },
    },
};