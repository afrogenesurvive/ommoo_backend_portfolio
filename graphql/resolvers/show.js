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
        getAllPublicShows: async (_, {args}, { req }) => {
            console.log("Resolver: getAllPublicShows...");
            // if (!req.raw.isAuth) {
            // throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            // }
            try {
                const query = JSON.parse(args);
                let include = [];
                let where_like = [];
                let where = { is_deleted: 'N' };
                

                query.includes.forEach(incl => {
                    switch (incl) {
                    case 'production_company':
                        include.push({ 
                        model: production_company, 
                        as: 'production_company', 
                        foreignKey: 'production_company_id',
                        where: { is_deleted: 'N', private: false },
                        required: false,
                        });
                        break;
                    // case 'show_user':
                    //     include.push({ 
                    //     model: show_user, 
                    //     as: 'show_users', 
                    //     foreignKey: 'show_id',
                    //     where: { is_deleted: 'N' },
                    //     required: false,
                    //     include: [{
                    //         model: user, 
                    //         as: 'user', 
                    //         foreignKey: 'user_id',
                    //         where: { is_deleted: 'N' },
                    //         required: false,
                    //     }]
                    //     });
                    //     break;
                    case 'venue_show':
                        include.push({ 
                        model: venue_show, 
                        as: 'venue_shows', 
                        foreignKey: 'show_id',
                        where: { is_deleted: 'N' },
                        required: false,
                        include: [{
                            model: venue, 
                            as: 'venue', 
                            foreignKey: 'venue_id',
                            where: { is_deleted: 'N', private: false },
                            required: false,
                        }]
                        });
                        break;
                    // case 'venue_events':
                    //     include.push({ 
                    //     model: venue_event, 
                    //     as: 'venue_events', 
                    //     foreignKey: 'show_id',
                    //     where: { is_deleted: 'N' },
                    //     required: false,
                    //     include: [
                    //         {
                    //         model: venue, 
                    //         as: 'venue', 
                    //         foreignKey: 'venue_id',
                    //         where: { is_deleted: 'N' },
                    //         required: false,
                    //         },
                    //         {
                    //         model: event, 
                    //         as: 'event', 
                    //         foreignKey: 'event_id',
                    //         where: { is_deleted: 'N' },
                    //         required: false,
                    //         }
                    //     ]
                    //     });
                    //     break;
                    case 'review':
                        include.push({ 
                        model: review, 
                        as: 'reviews', 
                        foreignKey: 'show_id',
                        where: { is_deleted: 'N', private: false },
                        required: false,
                        include: [
                            { 
                                model: user, 
                                as: 'user', 
                                foreignKey: 'user_id',
                                where: { is_deleted: 'N', private: false },
                                required: false,
                            },
                            { 
                                model: rating, 
                                as: 'ratings', 
                                foreignKey: 'review_id',
                                where: { is_deleted: 'N', private: false },
                                required: false,
                            }
                        ]
                        });
                        break;
                    case 'rating':
                        include.push({ 
                        model: rating, 
                        as: 'ratings', 
                        foreignKey: 'show_id',
                        where: { is_deleted: 'N' },
                        required: false,
                        include: [{ 
                            model: user, 
                            as: 'user', 
                            foreignKey: 'user_id',
                            where: { is_deleted: 'N', private: false },
                            required: false,
                        }]
                        });
                        break;
                    case 'tag':
                        include.push({ 
                        model: tag, 
                        as: 'tags', 
                        foreignKey: 'entity_id',
                        where: { is_deleted: 'N', private: false },
                        required: false,
                        });
                        break;
                    case 'like':
                        include.push({ 
                        model: like, 
                        as: 'likes', 
                        foreignKey: 'entity_id', 
                        where: { is_deleted: 'N', private: false },
                        required: false 
                        });
                        break;
                    case 'file':
                        include.push({ 
                            model: file, 
                            as: 'files', 
                            foreignKey: 'entity_id', 
                            where: { is_deleted: 'N', private: false },
                            required: false 
                        });
                        break;
                    // case 'contact':
                    //     include.push({ 
                    //     model: contact, 
                    //     as: 'contacts', 
                    //     foreignKey: 'entity_id',
                    //     where: { is_deleted: 'N' },
                    //     required: false,
                    //     });
                    //     break;
                    case 'watchlist_item':
                        include.push({ 
                        model: watchlist_item, 
                        as: 'watchlist_items', 
                        foreignKey: 'show_id',
                        where: { is_deleted: 'N', private: false },
                        required: false,
                        include: [{
                            model: watchlist, 
                            as: 'watchlist', 
                            foreignKey: 'watchlist_id',
                            where: { is_deleted: 'N', private: false },
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


                const shows = await show.findAll({
                    where: where,
                    include: include
                });

                addUserActivity(req, {
                    user_id: 'public',
                    request: 'getAllShows',
                });

                return shows.map(show => {
                    return {
                    ...show.dataValues,
                    _id: show.id
                    };
                });
            } catch (err) {
                throw err;
            }
        },
        getAllShows: async (_, {args}, { req }) => {
            console.log("Resolver: getAllShows...");
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
                case 'production_company':
                    include.push({ 
                    model: production_company, 
                    as: 'production_company', 
                    foreignKey: 'production_company_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'show_user':
                    include.push({ 
                    model: show_user, 
                    as: 'show_users', 
                    foreignKey: 'show_id',
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
                    foreignKey: 'show_id',
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
                // case 'venue_events':
                //     include.push({ 
                //     model: venue_event, 
                //     as: 'venue_events', 
                //     foreignKey: 'show_id',
                //     where: { is_deleted: 'N' },
                //     required: false,
                //     include: [
                //         {
                //         model: venue, 
                //         as: 'venue', 
                //         foreignKey: 'venue_id',
                //         where: { is_deleted: 'N' },
                //         required: false,
                //         },
                //         {
                //         model: event, 
                //         as: 'event', 
                //         foreignKey: 'event_id',
                //         where: { is_deleted: 'N' },
                //         required: false,
                //         }
                //     ]
                //     });
                //     break;
                case 'review':
                    include.push({ 
                    model: review, 
                    as: 'reviews', 
                    foreignKey: 'show_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [
                        { 
                            model: user, 
                            as: 'user', 
                            foreignKey: 'user_id',
                            where: { is_deleted: 'N' },
                            required: false,
                        },
                        { 
                            model: rating, 
                            as: 'ratings', 
                            foreignKey: 'review_id',
                            where: { is_deleted: 'N' },
                            required: false,
                        }
                    ]
                    });
                    break;
                case 'rating':
                    include.push({ 
                    model: rating, 
                    as: 'ratings', 
                    foreignKey: 'show_id',
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
                case 'contact':
                    include.push({ 
                    model: contact, 
                    as: 'contacts', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'watchlist_item':
                    include.push({ 
                    model: watchlist_item, 
                    as: 'watchlist_items', 
                    foreignKey: 'show_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [{
                        model: watchlist, 
                        as: 'watchlist', 
                        foreignKey: 'watchlist_id',
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

            const shows = await show.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getAllShows',
            });

            return shows.map(show => {
                return {
                ...show.dataValues,
                _id: show.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
        getShow: async (_, { id }, { req }) => {
            console.log("Resolver: getShowById...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const show_ = await show.findOne({
                where: { 
                    id: id,
                    is_deleted: 'N' 
                },
                include: [
                    { 
                        model: production_company, 
                        as: 'production_company', 
                        foreignKey: 'production_company_id',
                        where: { is_deleted: 'N' },
                        required: false,
                    },
                    { 
                        model: show_user, 
                        as: 'show_users', 
                        foreignKey: 'show_id',
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
                        foreignKey: 'show_id',
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
                    // { 
                    //     model: venue_event, 
                    //     as: 'venue_events', 
                    //     foreignKey: 'show_id',
                    //     where: { is_deleted: 'N' },
                    //     required: false,
                    //     include: [
                    //         {
                    //         model: venue, 
                    //         as: 'venue', 
                    //         foreignKey: 'venue_id',
                    //         where: { is_deleted: 'N' },
                    //         required: false,
                    //         },
                    //         {
                    //         model: event, 
                    //         as: 'event', 
                    //         foreignKey: 'event_id',
                    //         where: { is_deleted: 'N' },
                    //         required: false,
                    //         }
                    //     ]
                    // },
                    { 
                        model: review, 
                        as: 'reviews', 
                        foreignKey: 'show_id',
                        where: { is_deleted: 'N' },
                        required: false,
                        include: [
                            { 
                                model: user, 
                                as: 'user', 
                                foreignKey: 'user_id',
                                where: { is_deleted: 'N' },
                                required: false,
                            },
                            { 
                                model: rating, 
                                as: 'ratings', 
                                foreignKey: 'review_id',
                                where: { is_deleted: 'N' },
                                required: false,
                            }
                        ]
                    },
                    { 
                        model: rating, 
                        as: 'ratings', 
                        foreignKey: 'show_id',
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
                    },
                    { 
                        model: contact, 
                        as: 'contacts', 
                        foreignKey: 'entity_id',
                        where: { is_deleted: 'N' },
                        required: false,
                    },
                    { 
                        model: watchlist_item, 
                        as: 'watchlist_items', 
                        foreignKey: 'show_id',
                        where: { is_deleted: 'N' },
                        required: false,
                        include: [{
                            model: watchlist, 
                            as: 'watchlist', 
                            foreignKey: 'watchlist_id',
                            where: { is_deleted: 'N' },
                            required: false,
                        }]
                    }
                ]
            });
            if (!show_) {
                throw new Error('Show not found');
            }

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getShow',
            });

            return {
                ...show_.dataValues,
                _id: show_.id
            };
            } catch (err) {
            throw err;
            }
        },
        getShowByQuery: async (_, {args}, { req }) => {
            console.log("Resolver: getShowByQuery...");
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
                case 'production_company':
                    include.push({ 
                    model: production_company, 
                    as: 'production_company', 
                    foreignKey: 'production_company_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'show_user':
                    include.push({ 
                    model: show_user, 
                    as: 'show_users', 
                    foreignKey: 'show_id',
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
                    foreignKey: 'show_id',
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
                // case 'venue_events':
                //     include.push({ 
                //     model: venue_event, 
                //     as: 'venue_events', 
                //     foreignKey: 'show_id',
                //     where: { is_deleted: 'N' },
                //     required: false,
                //     include: [
                //         {
                //         model: venue, 
                //         as: 'venue', 
                //         foreignKey: 'venue_id',
                //         where: { is_deleted: 'N' },
                //         required: false,
                //         },
                //         {
                //         model: event, 
                //         as: 'event', 
                //         foreignKey: 'event_id',
                //         where: { is_deleted: 'N' },
                //         required: false,
                //         }
                //     ]
                //     });
                //     break;
                case 'review':
                    include.push({ 
                    model: review, 
                    as: 'reviews', 
                    foreignKey: 'show_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [
                        { 
                            model: user, 
                            as: 'user', 
                            foreignKey: 'user_id',
                            where: { is_deleted: 'N' },
                            required: false,
                        },
                        { 
                            model: rating, 
                            as: 'ratings', 
                            foreignKey: 'review_id',
                            where: { is_deleted: 'N' },
                            required: false,
                        }
                    ]
                    });
                    break;
                case 'rating':
                    include.push({ 
                    model: rating, 
                    as: 'ratings', 
                    foreignKey: 'show_id',
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
                case 'contact':
                    include.push({ 
                    model: contact, 
                    as: 'contacts', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'watchlist_item':
                    include.push({ 
                    model: watchlist_item, 
                    as: 'watchlist_items', 
                    foreignKey: 'show_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [{
                        model: watchlist, 
                        as: 'watchlist', 
                        foreignKey: 'watchlist_id',
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

            const shows = await show.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getShowByQuery',
            });

            return shows.map(show => {
                return {
                ...show.dataValues,
                _id: show.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
    },
    Mutation: {
        createShow: async (_, { showInput }, { req }) => {
            console.log("Resolver: createShow...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

            const existingShow = await show.findOne({
                where: {
                    title: showInput.title,
                    is_deleted: 'N'
                }
            });
        
            if (existingShow) {
                throw new Error('Show with this title already exists');
            }

            const show_ = await show.create({
                ...showInput,
                create_time: moment().format(),
                created_by: req.raw.user.id,
                is_deleted: 'N'
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'createShow',
            });

            return {
                ...show_.dataValues,
                _id: show_.id
            };
            } catch (err) {
            throw err;
            }
        },
        updateShow: async (_, { id, showInput }, { req }) => {
            console.log("Resolver: updateShow...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const access = await canEditExistingEntity(req, {
                    entity_type: 'show',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

                const show_ = await show.findOne({
                    where: { 
                    id: id,
                    is_deleted: 'N'
                    }
                });

                await show_.update({
                    ...showInput,
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'updateShow',
                });

                return {
                    ...show_.dataValues,
                    _id: show_.id
                };
            } catch (err) {
            throw err;
            }
        },
        deleteShow: async (_, { id }, { req }) => {
            console.log("Resolver: deleteShow...");
            if (!req.raw.isAuth) {
                throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            
                const access = await canEditExistingEntity(req, {
                    entity_type: 'show',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

                const show_ = await show.findOne({ where: { id: id } });
                await show_.update({
                    is_deleted: 'Y',
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });


                await review.update(
                    { is_deleted: 'Y', update_time: moment().format(), updated_by: req.raw.user.id },
                    { where: { show_id: id } }
                );
                await rating.update(
                    { is_deleted: 'Y', update_time: moment().format(), updated_by: req.raw.user.id },
                    { where: { show_id: id } }
                );
                await tag.update(
                    { is_deleted: 'Y', update_time: moment().format(), updated_by: req.raw.user.id },
                    { where: { entity_id: id } }
                );

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'deleteShow',
                });

                return {
                    ...show_.dataValues,
                    _id: show_.id
                };

            } catch (err) {
                throw err;
            }
        },
    },
};