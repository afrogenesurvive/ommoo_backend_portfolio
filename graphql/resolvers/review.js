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
        getAllReviews: async (_, {args}, { req }) => {
            console.log("Resolver: getAllReviews...");
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
                case 'rating':
                    include.push({ 
                    model: rating, 
                    as: 'ratings', 
                    foreignKey: 'review_id',
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

            const reviews = await review.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getAllReviews',
            });

            return reviews.map(review => {
                return {
                ...review.dataValues,
                _id: review.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
        getReview: async (_, { id }, { req }) => {
            console.log("Resolver: getReviewById...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const review_ = await review.findOne({
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
                    model: venue, 
                    as: 'venue', 
                    foreignKey: 'venue_id',
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
                    model: event, 
                    as: 'event', 
                    foreignKey: 'event_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: rating, 
                    as: 'ratings', 
                    foreignKey: 'review_id',
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
                },
                ]
            });
            if (!review_) {
                throw new Error('Review not found');
            }

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getReview',
            });

            return {
                ...review_.dataValues,
                _id: review_.id
            };
            } catch (err) {
            throw err;
            }
        },
        getReviewByQuery: async (_, {args}, { req }) => {
            console.log("Resolver: getReviewByQuery...");
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
                case 'rating':
                    include.push({ 
                    model: rating, 
                    as: 'ratings', 
                    foreignKey: 'review_id',
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

            const reviews = await review.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getReviewByQuery',
            });

            return reviews.map(review => {
                return {
                ...review.dataValues,
                _id: review.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
    },
    Mutation: {
        createGuestReview: async (_, { reviewInput }, { req }) => {
            console.log("Resolver: createGuestReview...");

            try {
            
                const show_ = await show.findOne({
                    where: {
                        id: reviewInput.show_id,
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

                const existingReview = await review.findOne({
                    where: {
                        user_id: reviewInput.user_id,
                        show_id: reviewInput.show_id,
                        venue_show_id: reviewInput.venue_show_id,
                        is_deleted: 'N',
                        held: true,
                    }
                });

                if (existingReview) {
                    throw new Error('User has already written a review for this show');
                }

                const user_show_ = await show_user.create({
                    user_id: reviewInput.user_id,
                    show_id: reviewInput.show_id,
                    venue_show_id: reviewInput.venue_show_id,
                    attendance_type: 'AUDIENCE',
                    create_time: moment().format(),
                    created_by: adminUser.id,
                    is_deleted: 'N'
                });

                const review_ = await review.create({
                    user_id: reviewInput.user_id,
                    show_id: reviewInput.show_id,
                    show_user_id: user_show_.id,
                    venue_show_id: reviewInput.venue_show_id,
                    type: 'AUDIENCE',
                    review: reviewInput.review,
                    private: false,
                    held: true,
                    create_time: moment().format(),
                    created_by: adminUser.id,
                    is_deleted: 'N'
                });

                addUserActivity(req, {
                    user_id: reviewInput.user_id,
                    request: 'createGuestReview',
                });

                return {
                    ...review_.dataValues,
                    _id: review_.id
                };
            } catch (err) {
            throw err;
            }
        },
        createReview: async (_, { reviewInput }, { req }) => {
            console.log("Resolver: createReview...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

            
                const show_ = await show.findOne({
                    where: {
                        id: reviewInput.show_id,
                        is_deleted: 'N'
                    }
                });

                if (!show_) {
                    throw new Error('Show not found');
                }

                const userAttendedShow = await show_user.findOne({
                    where: {
                        user_id: reviewInput.user_id,
                        show_id: reviewInput.show_id,
                        is_deleted: 'N'
                    }
                });
            
                if (!userAttendedShow) {
                    throw new Error('User hasnt attended show. Cannot review.');
                }
                
                const existingReviewType = await review.findOne({
                    where: {
                        user_id: reviewInput.user_id,
                        show_id: reviewInput.show_id,
                        type: reviewInput.type,
                        is_deleted: 'N'
                    }
                });
            
                if (existingReviewType) {
                    throw new Error('User has already written this type of review for this show');
                }

                const review_ = await review.create({
                    ...reviewInput,
                    create_time: moment().format(),
                    created_by: req.raw.user.id,
                    is_deleted: 'N'
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'createReview',
                });

                return {
                    ...review_.dataValues,
                    _id: review_.id
                };
            } catch (err) {
            throw err;
            }
        },
        updateReview: async (_, { id, reviewInput }, { req }) => {
            console.log("Resolver: updateReview...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const access = await canEditExistingEntity(req, {
                    entity_type: 'review',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

                const review_ = await review.findOne({
                    where: { 
                    id: id,
                    is_deleted: 'N'
                    }
                });

                await review_.update({
                    ...reviewInput,
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'updateReview',
                });

                return {
                    ...review_.dataValues,
                    _id: review_.id
                };
            } catch (err) {
            throw err;
            }
        },
        deleteReview: async (_, { id }, { req }) => {
            console.log("Resolver: deleteReview...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const access = await canEditExistingEntity(req, {
                    entity_type: 'review',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

                const review_ = await review.findOne({ where: { id: id } });
                await review_.update({
                    is_deleted: 'Y',
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'deleteReview',
                });

                return {
                    ...review_.dataValues,
                    _id: review_.id
                };
            } catch (err) {
            throw err;
            }
        },
        setReviewHold: async (_, { id, state }, { req }) => {
            console.log("Resolver: setReviewHold...");
            if (!req.raw.isAuth) {
                throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
                
                if (req.raw?.user?.role !== 'ADMIN') {
                    throw new Error('Only admin can hold/unhold review');
                }

                const review_ = await review.findOne({ where: { id: id } });
                if (!review_) {
                    throw new Error('Review not found');
                }
                await review_.update({
                    held: state,
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'setReviewHold',
                });

                return {
                    ...review_.dataValues,
                    _id: review_.id
                };
            } catch (err) {
            throw err;
            }
        },
    },
};