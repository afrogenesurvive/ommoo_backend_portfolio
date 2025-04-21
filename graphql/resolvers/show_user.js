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
        getAllShowUsers: async (_, {args}, { req }) => {
            console.log("Resolver: getAllShowUsers...");
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
                case 'show':
                    include.push({ 
                        model: show, 
                        as: 'show', 
                        foreignKey: 'show_id',
                        where: { is_deleted: 'N' },
                        required: false,
                    });
                    break;
                case 'venue_show':
                    include.push({ 
                        model: venue_show, 
                        as: 'venue_show', 
                        foreignKey: 'venue_show_id',
                        where: { is_deleted: 'N' },
                        required: false,
                        include: [{
                            model: venue, 
                            as: 'venue', 
                            foreignKey: 'venue_id',
                            where: { is_deleted: 'N' },
                            required: false,
                        }]
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

            const showUsers = await show_user.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getAllShowUsers',
            });

            return showUsers.map(showUser => {
                return {
                ...showUser.dataValues,
                _id: showUser.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
        getShowUser: async (_, { id }, { req }) => {
            console.log("Resolver: getShowUserById...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const showUser = await show_user.findOne({
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
                    model: show, 
                    as: 'show', 
                    foreignKey: 'show_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: venue_show, 
                    as: 'venue_show', 
                    foreignKey: 'venue_show_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [{ 
                        model: venue, 
                        as: 'venue', 
                        foreignKey: 'venue_id',
                        where: { is_deleted: 'N' },
                        required: false,
                    }]
                },
                ]
            });
            if (!showUser) {
                throw new Error('Show User not found');
            }

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getShowUser',
            });

            return {
                ...showUser.dataValues,
                _id: showUser.id
            };
            } catch (err) {
            throw err;
            }
        },
        getShowUserByQuery: async (_, {args}, { req }) => {
            console.log("Resolver: getShowUserByQuery...");
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
                case 'show':
                    include.push({ 
                    model: show, 
                    as: 'show', 
                    foreignKey: 'show_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'venue_show':
                    include.push({ 
                        model: venue_show, 
                        as: 'venue_show', 
                        foreignKey: 'venue_show_id',
                        where: { is_deleted: 'N' },
                        required: false,
                        include: [{
                            model: venue, 
                            as: 'venue', 
                            foreignKey: 'venue_id',
                            where: { is_deleted: 'N' },
                            required: false,
                        }]
                    });
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

            const showUsers = await show_user.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getShowUserByQuery',
            });

            return showUsers.map(showUser => {
                return {
                ...showUser.dataValues,
                _id: showUser.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
    },
    Mutation: {
        createShowUser: async (_, { showUserInput }, { req }) => {
            console.log("Resolver: createShowUser...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const userExists = await user.findOne({ where: { id: showUserInput.user_id } });
                const showExists = await show.findOne({ where: { id: showUserInput.show_id } });

                if (
                    !userExists || 
                    !showExists
                ) {
                    throw new Error('User or Show not found');
                }

                const existingShowUser = await show_user.findOne({
                where: {
                    show_id: showUserInput.show_id,
                    user_id: showUserInput.user_id,
                    attendance_type: showUserInput.attendance_type,
                    is_deleted: 'N'
                }
                });
        
                if (existingShowUser) {
                    throw new Error(`User for this show w/ same ateendance type -msg-show_user_id=${existingShowUser.id}`);
                }

                const showUser = await show_user.create({
                    ...showUserInput,
                    create_time: moment().format(),
                    created_by: req.raw.user.id,
                    is_deleted: 'N'
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'createShowUser',
                });

                return {
                    ...showUser.dataValues,
                    _id: showUser.id
                };
            } catch (err) {
            throw err;
            }
        },
        updateShowUser: async (_, { id, showUserInput }, { req }) => {
            console.log("Resolver: updateShowUser...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const userExists = await user.findOne({ where: { id: showUserInput.user_id } });
                const showExists = await show.findOne({ where: { id: showUserInput.show_id } });

                if (
                    !userExists || 
                    !showExists
                ) {
                    throw new Error('User or Show not found');
                }

                const access = await canEditExistingEntity(req, {
                    entity_type: 'show_user',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }
                
                const showUser = await show_user.findOne({
                    where: { 
                    id: id,
                    is_deleted: 'N'
                    }
                });

                await showUser.update({
                    ...showUserInput,
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'updateShowUser',
                });

                return {
                    ...showUser.dataValues,
                    _id: showUser.id
                };
            } catch (err) {
            throw err;
            }
        },
        deleteShowUser: async (_, { id }, { req }) => {
            console.log("Resolver: deleteShowUser...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
                const showUser = await show_user.findOne({ where: { id: id } });

                const access = await canEditExistingEntity(req, {
                    entity_type: 'show_user',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }
                
                await showUser.update({
                    is_deleted: 'Y',
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'deleteShowUser',
                });

                return {
                    ...showUser.dataValues,
                    _id: showUser.id
                };
            } catch (err) {
            throw err;
            }
        },
    },
};