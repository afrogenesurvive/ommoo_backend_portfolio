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

module.exports = {
    Query: {
        getAllActivity: async (_, {args}, { req }) => {
            console.log("Resolver: getAllActivity...");
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

            const allActivity = await activity.findAll({
                where: where,
                include: include
            });
            return allActivity.map(activity => {
                return {
                ...activity.dataValues,
                _id: activity.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
        getUserActivity: async (_, { user_id }, { req }) => {
            console.log("Resolver: getUserActivity...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const allActivity = await activity.findAll({
                where: { 
                    user_id: user_id,
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
                ]
            });
            if (!allActivity) {
                throw new Error('Review not found');
            }
            return allActivity.map(activity => {
                return {
                ...activity.dataValues,
                _id: activity.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
        getActivityByQuery: async (_, {args}, { req }) => {
            console.log("Resolver: getActivityByQuery...");
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

                const allActivity = await activity.findAll({
                    where: where,
                    include: include
                });
                
                return allActivity.map(activity => {
                    return {
                    ...activity.dataValues,
                    _id: activity.id
                    };
                });
            } catch (err) {
            throw err;
            }
        },
    },
};