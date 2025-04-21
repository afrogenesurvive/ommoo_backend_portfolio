const moment = require('moment-timezone');
const { 
    user, 
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
        getAllEvents: async (_, {args}, { req }) => {
            console.log("Resolver: getAllEvents...");
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
                    required: false 
                    });
                    break;
                case 'venue_events':
                    include.push({ 
                    model: venue_event, 
                    as: 'venue_event', 
                    foreignKey: 'event_id', 
                    where: { is_deleted: 'N' }, 
                    required: false ,
                    include: [{ 
                        model: venue, 
                        as: 'venue', 
                        foreignKey: 'venue_id', 
                        where: { is_deleted: 'N' }, 
                        required: false 
                        }]
                    });
                    break;
                case 'venue_show':
                    include.push({ 
                    model: venue_show, 
                    as: 'venue_shows', 
                    foreignKey: 'event_id', 
                    where: { is_deleted: 'N' }, 
                    required: false,
                    include: [{ 
                        model: venue, 
                        as: 'venue', 
                        foreignKey: 'venue_id', 
                        where: { is_deleted: 'N' }, 
                        required: false 
                        }]
                    });
                    break;
                case 'review':
                    include.push({ 
                    model: review, 
                    as: 'reviews', 
                    foreignKey: 'event_id', 
                    where: { is_deleted: 'N' }, 
                    required: false 
                    });
                    break;
                case 'rating':
                    include.push({ 
                    model: rating, 
                    as: 'ratings', 
                    foreignKey: 'event_id', 
                    where: { is_deleted: 'N' }, 
                    required: false 
                    });
                    break;
                case 'tag':
                    include.push({ 
                    model: tag, 
                    as: 'tags', 
                    foreignKey: 'entity_id', 
                    where: { is_deleted: 'N' }, 
                    required: false 
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

            const events = await event.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getAllEvents',
            });

            return events.map(event => {
                return {
                ...event.dataValues,
                _id: event.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
        getEvent: async (_, { id }, { req }) => {
            console.log("Resolver: getEventById...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const event_ = await event.findOne({
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
                    required: false 
                },
                { 
                    model: venue_event, 
                    as: 'venue_events', 
                    foreignKey: 'event_id', 
                    where: { is_deleted: 'N' }, 
                    required: false,
                    include: [{ 
                        model: venue, 
                        as: 'venue', 
                        foreignKey: 'venue_id', 
                        where: { is_deleted: 'N' }, 
                        required: false 
                    }]
                },
                { 
                    model: venue_show, 
                    as: 'venue_shows', 
                    foreignKey: 'event_id', 
                    where: { is_deleted: 'N' }, 
                    required: false,
                    include: [{ 
                        model: venue, 
                        as: 'venue', 
                        foreignKey: 'venue_id', 
                        where: { is_deleted: 'N' }, 
                        required: false 
                    }]
                },
                { 
                    model: review, 
                    as: 'reviews', 
                    foreignKey: 'event_id', 
                    where: { is_deleted: 'N' }, 
                    required: false 
                },
                { 
                    model: rating, 
                    as: 'ratings', 
                    foreignKey: 'event_id', 
                    where: { is_deleted: 'N' }, 
                    required: false 
                },
                { 
                    model: tag, 
                    as: 'tags', 
                    foreignKey: 'entity_id', 
                    where: { is_deleted: 'N' }, 
                    required: false 
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
                },
                ]
            });
            if (!event_) {
                throw new Error('Event not found');
            }

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getEvent',
            });

            return {
                ...event_.dataValues,
                _id: event_.id
            };
            } catch (err) {
            throw err;
            }
        },
        getEventByQuery: async (_, {args}, { req }) => {
            console.log("Resolver: getEventByQuery...");
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
                    required: false 
                    });
                    break;
                case 'venue_event':
                    include.push({ 
                    model: venue_event, 
                    as: 'venue_events', 
                    foreignKey: 'event_id', 
                    where: { is_deleted: 'N' }, 
                    required: false,
                    include: [{ 
                        model: venue, 
                        as: 'venue', 
                        foreignKey: 'venue_id', 
                        where: { is_deleted: 'N' }, 
                        required: false 
                        }]
                    });
                    break;
                case 'venue_show':
                    include.push({ 
                    model: venue_show, 
                    as: 'venue_shows', 
                    foreignKey: 'event_id', 
                    where: { is_deleted: 'N' }, 
                    required: false,
                    include: [{ 
                        model: venue, 
                        as: 'venue', 
                        foreignKey: 'venue_id', 
                        where: { is_deleted: 'N' }, 
                        required: false 
                        }]
                    });
                    break;
                case 'review':
                    include.push({ 
                    model: review, 
                    as: 'reviews', 
                    foreignKey: 'event_id', 
                    where: { is_deleted: 'N' }, 
                    required: false 
                    });
                    break;
                case 'rating':
                    include.push({ 
                    model: rating, 
                    as: 'ratings', 
                    foreignKey: 'event_id', 
                    where: { is_deleted: 'N' }, 
                    required: false 
                    });
                    break;
                case 'tag':
                    include.push({ 
                    model: tag, 
                    as: 'tags', 
                    foreignKey: 'entity_id', 
                    where: { is_deleted: 'N' }, 
                    required: false 
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

            const events = await event.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getEventByQuery',
            });


            return events.map(event => {
                return {
                ...event.dataValues,
                _id: event.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
    },
    Mutation: {
        createEvent: async (_, { eventInput }, { req }) => {
            console.log("Resolver: createEvent...");
            if (!req.raw.isAuth) {
                throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const event_ = await event.create({
                ...eventInput,
                create_time: moment().format(),
                created_by: req.raw.user.id,
                is_deleted: 'N'
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'createEvent',
            });

            return {
                ...event_.dataValues,
                _id: event_.id
            };
            } catch (err) {
            throw err;
            }
        },
        updateEvent: async (_, { id, eventInput }, { req }) => {
            console.log("Resolver: updateEvent...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const access = await canEditExistingEntity(req, {
                    entity_type: 'event',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

            const event_ = await event.findOne({
                where: { 
                id: id,
                is_deleted: 'N'
                }
            });
            await event_.update({
                ...eventInput,
                update_time: moment().format(),
                updated_by: req.raw.user.id,
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'updateEvent',
            });

            return {
                ...event_.dataValues,
                _id: event_.id
            };
            } catch (err) {
            throw err;
            }
        },
        deleteEvent: async (_, { id }, { req }) => {
            console.log("Resolver: deleteEvent...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const access = await canEditExistingEntity(req, {
                    entity_type: 'event',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

            const event_ = await event.findOne({ where: { id: id, is_deleted: 'N' } });
            await event_.update({
                is_deleted: 'Y',
                update_time: moment().format(),
                updated_by: req.raw.user.id,
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'deleteEvent',
            });

            return {
                ...event_.dataValues,
                _id: event_.id
            };
            } catch (err) {
            throw err;
            }
        },
    }
};