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
        getAllVenueShows: async (_, {args}, { req }) => {
            console.log("Resolver: getAllVenueShows...");
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
                case 'show':
                    include.push({ 
                    model: show, 
                    as: 'show', 
                    foreignKey: 'show_id',
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
                case 'venue_event':
                    include.push({ 
                    model: venue_event, 
                    as: 'venue_event', 
                    foreignKey: 'venue_event_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [
                        {
                        model: event, 
                        as: 'event', 
                        foreignKey: 'event_id',
                        where: { is_deleted: 'N' },
                        required: false,
                        },
                        {
                        model: venue, 
                        as: 'venue', 
                        foreignKey: 'venue_id',
                        where: { is_deleted: 'N' },
                        required: false,
                        },
                    ]
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

            const venueShows = await venue_show.findAll({
                where: where,
                include: include
            });
            return venueShows.map(venueShow => {
                return {
                ...venueShow.dataValues,
                _id: venueShow.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
        getVenueShow: async (_, { id }, { req }) => {
            console.log("Resolver: getVenueShowById...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const venueShow = await venue_show.findOne({
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
                    model: show, 
                    as: 'show', 
                    foreignKey: 'show_id',
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
                    model: venue_event, 
                    as: 'venue_event', 
                    foreignKey: 'venue_event_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [
                        {
                        model: event, 
                        as: 'event', 
                        foreignKey: 'event_id',
                        where: { is_deleted: 'N' },
                        required: false,
                        },
                        {
                        model: venue, 
                        as: 'venue', 
                        foreignKey: 'venue_id',
                        where: { is_deleted: 'N' },
                        required: false,
                        },
                    ]
                },
                ]
            });
            if (!venueShow) {
                throw new Error('Venue Show not found');
            }
            return {
                ...venueShow.dataValues,
                _id: venueShow.id
            };
            } catch (err) {
            throw err;
            }
        },
        getVenueShowByQuery: async (_, {args}, { req }) => {
            console.log("Resolver: getVenueShowByQuery...");
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
                case 'show':
                    include.push({ 
                    model: show, 
                    as: 'show', 
                    foreignKey: 'show_id',
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
                case 'venue_event':
                    include.push({ 
                    model: venue_event, 
                    as: 'venue_event', 
                    foreignKey: 'venue_event_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [
                        {
                        model: event, 
                        as: 'event', 
                        foreignKey: 'event_id',
                        where: { is_deleted: 'N' },
                        required: false,
                        },
                        {
                        model: venue, 
                        as: 'venue', 
                        foreignKey: 'venue_id',
                        where: { is_deleted: 'N' },
                        required: false,
                        },
                    ]
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

            const venueShows = await venue_show.findAll({
                where: where,
                include: include
            });
            return venueShows.map(venueShow => {
                return {
                ...venueShow.dataValues,
                _id: venueShow.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
    },
    Mutation: {
        createVenueShow: async (_, { venueShowInput }, { req }) => {
            console.log("Resolver: createVenueShow...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const venueExists = await venue.findOne({ where: { id: venueShowInput.venue_id } });
                const showExists = await show.findOne({ where: { id: venueShowInput.show_id } });

                if (
                    !venueExists || 
                    !showExists
                ) {
                    throw new Error('Venue or Show not found');
                }

                const venueShow = await venue_show.create({
                    ...venueShowInput,
                    create_time: moment().format(),
                    created_by: req.raw.user.id,
                    is_deleted: 'N'
                });

                return {
                    ...venueShow.dataValues,
                    _id: venueShow.id
                };

            } catch (err) {
            throw err;
            }
        },
        updateVenueShow: async (_, { id, venueShowInput }, { req }) => {
            console.log("Resolver: updateVenueShow...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const venueExists = await venue.findOne({ where: { id: venueShowInput.venue_id } });
                const showExists = await show.findOne({ where: { id: venueShowInput.show_id } });

                if (
                    !venueExists || 
                    !showExists
                ) {
                    throw new Error('Venue or Show not found');
                }

                const access = await canEditExistingEntity(req, {
                    entity_type: 'venue_show',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

                const venueShow = await venue_show.findOne({
                    where: { 
                    id: id,
                    is_deleted: 'N'
                    }
                });

                await venueShow.update({
                    ...venueShowInput,
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                return {
                    ...venueShow.dataValues,
                    _id: venueShow.id
                };
                
            } catch (err) {
            throw err;
            }
        },
        deleteVenueShow: async (_, { id }, { req }) => {
            console.log("Resolver: deleteVenueShow...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const access = await canEditExistingEntity(req, {
                    entity_type: 'venue_show',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

                const venueShow = await venue_show.findOne({ where: { id: id } });
                await venueShow.update({
                    is_deleted: 'Y',
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });
                return {
                    ...venueShow.dataValues,
                    _id: venueShow.id
                };
            } catch (err) {
            throw err;
            }
        },
    }
};