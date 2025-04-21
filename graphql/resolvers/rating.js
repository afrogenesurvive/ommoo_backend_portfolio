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
        getAllRatings: async (_, {args}, { req }) => {
            console.log("Resolver: getAllRatings...");
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
                case 'show_user':
                    include.push({ 
                    model: show_user, 
                    as: 'show_user', 
                    foreignKey: 'show_user_id',
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
                case 'event':
                    include.push({ 
                    model: event, 
                    as: 'event', 
                    foreignKey: 'event_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'review':
                    include.push({ 
                    model: review, 
                    as: 'review', 
                    foreignKey: 'review_id',
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

            const ratings = await rating.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getAllRatings',
            });

            return ratings.map(rating => {
                return {
                ...rating.dataValues,
                _id: rating.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
        getRating: async (_, { id }, { req }) => {
            console.log("Resolver: getRatingById...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const rating_ = await rating.findOne({
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
                    model: show_user, 
                    as: 'show_user', 
                    foreignKey: 'show_user_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: venue_show, 
                    as: 'venue_show', 
                    foreignKey: 'venue_show_id',
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
                { 
                    model: event, 
                    as: 'event', 
                    foreignKey: 'event_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: review, 
                    as: 'review', 
                    foreignKey: 'review_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                ]
            });
            if (!rating_) {
                throw new Error('Rating not found');
            }

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getRating',
            });

            return {
                ...rating_.dataValues,
                _id: rating_.id
            };
            } catch (err) {
            throw err;
            }
        },
        getRatingByQuery: async (_, {args}, { req }) => {
            console.log("Resolver: getRatingByQuery...");
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
                case 'show_user':
                    include.push({ 
                    model: show_user, 
                    as: 'show_user', 
                    foreignKey: 'show_user_id',
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
                case 'event':
                    include.push({ 
                    model: event, 
                    as: 'event', 
                    foreignKey: 'event_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'review':
                    include.push({ 
                    model: review, 
                    as: 'review', 
                    foreignKey: 'review_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                default:
                    break;
                }
            });

            query.where_like?.forEach(whl => {
                // where_like.push({[wkhl.key]: { [Op.like]: `%${whl.value}%` }});
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

            const ratings = await rating.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getRatingByQuery',
            });

            return ratings.map(rating => {
                return {
                ...rating.dataValues,
                _id: rating.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
    },
    Mutation: {
        createGuestRating: async (_, { ratingInput }, { req }) => {
            console.log("Resolver: createGuestRating...");
            
            try {

                const show_ = await show.findOne({
                    where: {
                        id: ratingInput.show_id,
                        is_deleted: 'N'
                    }
                });

                if (!show_) {
                    throw new Error('Show not found');
                    
                }

                const adminUser = await user.findOne({
                    where: {
                        role: 'ADMIN',
                        is_deleted: 'N'
                    },
                    order: [['create_time', 'ASC']]
                });

                const existingRating = await rating.findOne({
                    where: {
                        user_id: ratingInput.user_id,
                        show_id: ratingInput.show_id,
                        venue_show_id: ratingInput.venue_show_id,
                        is_deleted: 'N',
                        held: true
                    }
                });

                if (existingRating) {
                    throw new Error('User has already rated this show');
                }


                const user_show_ = await show_user.create({
                    user_id: ratingInput.user_id,
                    show_id: ratingInput.show_id,
                    venue_show_id: ratingInput.venue_show_id,
                    attendance_type: 'AUDIENCE',
                    create_time: moment().format(),
                    created_by: adminUser.id,
                    is_deleted: 'N'
                });


                const rating_ = await rating.create({
                    user_id: ratingInput.user_id,
                    show_id: ratingInput.show_id,
                    value: ratingInput.value,
                    show_user_id: user_show_.id,
                    venue_show_id: ratingInput.venue_show_id,
                    review_id: ratingInput.review_id,
                    venue_id: ratingInput.venue_id,
                    type: "AUDIENCE",
                    private: false,
                    held: true,
                    create_time: moment().format(),
                    created_by: adminUser.id,
                    is_deleted: 'N'
                });


                addUserActivity(req, {
                    user_id: ratingInput.user_id,
                    request: 'createGuestRating',
                });

                return {
                    ...rating_.dataValues,
                    _id: rating_.id
                };
            } catch (err) {
            throw err;
            }
        },
        createRating: async (_, { ratingInput }, { req }) => {
            console.log("Resolver: createRating...");
            if (!req.raw.isAuth) {
                throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const show_ = await show.findOne({
                    where: {
                        id: ratingInput.show_id,
                        is_deleted: 'N'
                    }
                });

                if (!show_) {
                    throw new Error('Show not found');
                }

                const userAttendedShow = await show_user.findOne({
                    where: {
                        user_id: ratingInput.user_id,
                        show_id: ratingInput.show_id,
                        is_deleted: 'N'
                    }
                });
            
                if (!userAttendedShow) {
                    throw new Error('User hasnt attended show. Cannot rate.');
                }
                
                const existingRating = await rating.findOne({
                    where: {
                        user_id: ratingInput.user_id,
                        show_id: ratingInput.show_id,
                        is_deleted: 'N'
                    }
                });
            
                if (existingRating) {
                    throw new Error('User has already rated this show');
                }

                const rating_ = await rating.create({
                    ...ratingInput,
                    create_time: moment().format(),
                    created_by: req.raw.user.id,
                    is_deleted: 'N'
                });


                let new_average_rating = 0;
                const ratings = await rating.findAll({
                    where: {
                        show_id: ratingInput.show_id,
                        is_deleted: 'N'
                    }
                });

                if (ratings.length > 0) {
                    let total_rating = 0;
                    ratings.forEach(r => {
                        total_rating += r.value;
                    });
                    new_average_rating = total_rating / ratings.length;
                }
                
                // console.log('show new_average_rating', new_average_rating);
                
                show_.update({
                    average_rating: new_average_rating.toFixed(2),
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });


                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'createRating',
                });

                return {
                    ...rating_.dataValues,
                    _id: rating_.id
                };
            } catch (err) {
            throw err;
            }
        },
        updateRating: async (_, { id, ratingInput }, { req }) => {
            console.log("Resolver: updateRating...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const access = await canEditExistingEntity(req, {
                    entity_type: 'rating',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

                const rating_ = await rating.findOne({
                    where: { 
                    id: id,
                    is_deleted: 'N'
                    }
                });

                await rating_.update({
                    ...ratingInput,
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                let new_average_rating = 0;
                const ratings = await rating.findAll({
                    where: {
                        show_id: ratingInput.show_id,
                        is_deleted: 'N'
                    }
                });

                if (ratings.length > 0) {
                    let total_rating = 0;
                    ratings.forEach(r => {
                        total_rating += r.value;
                    });
                    new_average_rating = total_rating / ratings.length;
                }
                

                const show_ = await show.findOne({
                    where: {
                        id: ratingInput.show_id,
                        is_deleted: 'N'
                    }
                });

                show_.update({
                    average_rating: new_average_rating.toFixed(2),
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'updateRating',
                });

                return {
                    ...rating_.dataValues,
                    _id: rating_.id
                };
            } catch (err) {
            throw err;
            }
        },
        deleteRating: async (_, { id }, { req }) => {
            console.log("Resolver: deleteRating...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const access = await canEditExistingEntity(req, {
                    entity_type: 'rating',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }
                
                const rating_ = await rating.findOne({ where: { id: id } });
                await rating_.update({
                    is_deleted: 'Y',
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'deleteRating',
                });

                return {
                    ...rating_.dataValues,
                    _id: rating_.id
                };
            } catch (err) {
            throw err;
            }
        },
        setRatingHold: async (_, { id, state }, { req }) => {
            console.log("Resolver: setRatingHold...");
            if (!req.raw.isAuth) {
                throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
                
                if (req.raw?.user?.role !== 'ADMIN') {
                    throw new Error('Only admin can hold/unhold rating');
                }

                const rating_ = await rating.findOne({ where: { id: id } });
                if (!rating_) {
                    throw new Error('Rating not found');
                }
                await rating_.update({
                    held: state,
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'setRatingHold',
                });

                return {
                    ...rating_.dataValues,
                    _id: rating_.id
                };
            } catch (err) {
            throw err;
            }
        },
    }
};