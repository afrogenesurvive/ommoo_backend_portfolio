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
        getAllVenueEvents: async (_, {args}, { req }) => {
            console.log("Resolver: getAllVenueEvents...");
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
                case 'venue':
                    include.push({ 
                    model: venue, 
                    as: 'venue', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'event':
                    include.push({ 
                    model: event, 
                    as: 'event', 
                    foreignKey: 'event_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'show':
                    include.push({ 
                    model: show, 
                    as: 'show', 
                    foreignKey: 'show_id',
                    where: { is_deleted: 'N' },
                    required: false,
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

            const venueEvents = await venue_event.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getAllVenueEvents',
            });

            return venueEvents.map(venueEvent => {
                return {
                ...venueEvent.dataValues,
                _id: venueEvent.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
        getVenueEvent: async (_, { id }, { req }) => {
            console.log("Resolver: getVenueEventById...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const venueEvent = await venue_event.findOne({
                where: { 
                id: id,
                is_deleted: 'N' 
                },
                include: [
                { 
                    model: venue, 
                    as: 'venue', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: event, 
                    as: 'event', 
                    foreignKey: 'event_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: show, 
                    as: 'show', 
                    foreignKey: 'show_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                ]
            });
            if (!venueEvent) {
                throw new Error('Venue Event not found');
            }

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getVenueEvent',
            });

            return {
                ...venueEvent.dataValues,
                _id: venueEvent.id
            };
            } catch (err) {
            throw err;
            }
        },
        getVenueEventByQuery: async (_, {args}, { req }) => {
            console.log("Resolver: getVenueEventByQuery...");
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
                case 'venue':
                    include.push({ 
                    model: venue, 
                    as: 'venue', 
                    foreignKey: 'venue_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'event':
                    include.push({ 
                    model: event, 
                    as: 'event', 
                    foreignKey: 'event_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'show':
                    include.push({ 
                    model: show, 
                    as: 'show', 
                    foreignKey: 'show_id',
                    where: { is_deleted: 'N' },
                    required: false,
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

            const venueEvents = await venue_event.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getVenueEventByQuery',
            });

            return venueEvents.map(venueEvent => {
                return {
                ...venueEvent.dataValues,
                _id: venueEvent.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
    },
    Mutation: {
        createVenueEvent: async (_, { venueEventInput }, { req }) => {
            console.log("Resolver: createVenueEvent...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const venueExists = await user.findOne({ where: { id: venueEventInput.venue_id } });
                const eventExists = await user.findOne({ where: { id: venueEventInput.event_id } });

                if (!venueExists || !eventExists) {
                    throw new Error('Venue or Event not found');
                }

                const venueEvent = await venue_event.create({
                    ...venueEventInput,
                    create_time: moment().format(),
                    created_by: req.raw.user.id,
                    is_deleted: 'N'
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'createVenueEvent',
                });

                return {
                    ...venueEvent.dataValues,
                    _id: venueEvent.id
                };

            } catch (err) {
            throw err;
            }
        },
        updateVenueEvent: async (_, { id, venueEventInput }, { req }) => {
            console.log("Resolver: updateVenueEvent...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const venueExists = await user.findOne({ where: { id: venueEventInput.venue_id } });
                const eventExists = await user.findOne({ where: { id: venueEventInput.event_id } });

                if (!venueExists || !eventExists) {
                    throw new Error('Venue or Event not found');
                }

                const access = await canEditExistingEntity(req, {
                    entity_type: 'venue_event',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

                const venueEvent = await venue_event.findOne({
                    where: { 
                    id: id,
                    is_deleted: 'N'
                    }
                });
                await venueEvent.update({
                    ...venueEventInput,
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'updateVenueEvent',
                });

                return {
                    ...venueEvent.dataValues,
                    _id: venueEvent.id
                };
                
            } catch (err) {
            throw err;
            }
        },
        deleteVenueEvent: async (_, { id }, { req }) => {
            console.log("Resolver: deleteVenueEvent...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const access = await canEditExistingEntity(req, {
                    entity_type: 'venue_event',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }
                
                const venueEvent = await venue_event.findOne({ where: { id: id } });
                await venueEvent.update({
                    is_deleted: 'Y',
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'deleteVenueEvent',
                });

                return {
                    ...venueEvent.dataValues,
                    _id: venueEvent.id
                };
            } catch (err) {
            throw err;
            }
        },
    }
};