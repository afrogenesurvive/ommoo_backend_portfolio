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
        getAllVenueUsers: async (_, {args}, { req }) => {
            console.log("Resolver: getAllVenueUsers...");
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
                case 'user':
                    include.push({ 
                    model: user, 
                    as: 'user', 
                    foreignKey: 'user_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'venue':
                    include.push({ 
                    model: venue, 
                    as: 'venue', 
                    foreignKey: 'venue_id',
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

            const venueUsers = await venue_user.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getAllVenueUsers',
            });

            return venueUsers.map(venueUser => {
                return {
                ...venueUser.dataValues,
                _id: venueUser.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
        getVenueUser: async (_, { id }, { req }) => {
            console.log("Resolver: getVenueUserById...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const venueUser = await venue_user.findOne({
                where: { 
                id: id,
                is_deleted: 'N' 
                },
                include: [
                { 
                    model: user, 
                    as: 'user', 
                    foreignKey: 'user_id',
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
            if (!venueUser) {
                throw new Error('Venue User not found');
            }

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getVenueUser',
            });

            return {
                ...venueUser.dataValues,
                _id: venueUser.id
            };
            } catch (err) {
            throw err;
            }
        },
        getVenueUserByQuery: async (_, {args}, { req }) => {
            console.log("Resolver: getVenueUserByQuery...");
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
                case 'user':
                    include.push({ 
                    model: user, 
                    as: 'user', 
                    foreignKey: 'user_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'venue':
                    include.push({ 
                    model: venue, 
                    as: 'venue', 
                    foreignKey: 'venue_id',
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

            const venueUsers = await venue_user.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getVenueUserByQuery',
            });

            return venueUsers.map(venueUser => {
                return {
                ...venueUser.dataValues,
                _id: venueUser.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
    },
    Mutation: {
        createVenueUser: async (_, { venueUserInput }, { req }) => {
            console.log("Resolver: createVenueUser...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const venueExists = await user.findOne({ where: { id: venueUserInput.venue_id } });
                const userExists = await user.findOne({ where: { id: venueUserInput.user_id } });

                if (
                    !venueExists || 
                    !userExists
                ) {
                    throw new Error('Venue or User not found');
                }

                const venueUser = await venue_user.create({
                    ...venueUserInput,
                    create_time: moment().format(),
                    created_by: req.raw.user.id,
                    is_deleted: 'N'
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'createVenueUser',
                });

                return {
                    ...venueUser.dataValues,
                    _id: venueUser.id
                };

            } catch (err) {
            throw err;
            }
        },
        updateVenueUser: async (_, { id, venueUserInput }, { req }) => {
            console.log("Resolver: updateVenueUser...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const venueExists = await user.findOne({ where: { id: venueUserInput.venue_id } });
                const userExists = await user.findOne({ where: { id: venueUserInput.user_id } });

                if (
                    !venueExists || 
                    !userExists
                ) {
                    throw new Error('Venue or User not found');
                }

                const access = await canEditExistingEntity(req, {
                    entity_type: 'venue_user',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }


                const venueUser = await venue_user.findOne({
                    where: { 
                    id: id,
                    is_deleted: 'N'
                    }
                });
                
                await venueUser.update({
                    ...venueUserInput,
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'updateVenueUser',
                });

                return {
                    ...venueUser.dataValues,
                    _id: venueUser.id
                };

            } catch (err) {
            throw err;
            }
        },
        deleteVenueUser: async (_, { id }, { req }) => {
            console.log("Resolver: deleteVenueUser...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
                const access = await canEditExistingEntity(req, {
                    entity_type: 'venue_user',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }
                
                const venueUser = await venue_user.findOne({ where: { id: id } });
                await venueUser.update({
                    is_deleted: 'Y',
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'deleteVenueUser',
                });

                return {
                    ...venueUser.dataValues,
                    _id: venueUser.id
                };
            } catch (err) {
            throw err;
            }
        },
    },
};