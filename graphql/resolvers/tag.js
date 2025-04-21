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

const modelMapping = require('../../db/config/model_mapping');


const { Op } = require('sequelize');

const { addUserActivity, canEditExistingEntity } = require('../../middleware/utils/utils');


module.exports = {
    Query: {
        getAllTags: async (_, {args}, { req }) => {
            console.log("Resolver: getAllTags...");
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
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'production_company':
                    include.push({ 
                    model: production_company, 
                    as: 'production_company', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'venue':
                    include.push({ 
                    model: venue, 
                    as: 'venue', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'show':
                    include.push({ 
                    model: show, 
                    as: 'show', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'event':
                    include.push({ 
                    model: event, 
                    as: 'event', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'review':
                    include.push({ 
                    model: review, 
                    as: 'review', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'watchlist':
                    include.push({ 
                    model: review, 
                    as: 'watchlist', 
                    foreignKey: 'entity_id',
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

            const tags = await tag.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getAllTags',
            });

            return tags.map(tag => {
                return {
                ...tag.dataValues,
                _id: tag.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
        getTag: async (_, { id }, { req }) => {
            console.log("Resolver: getTagById...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const tag_ = await tag.findOne({
                where: { 
                id: id,
                is_deleted: 'N' 
                },
                include: [
                { 
                    model: user, 
                    as: 'user', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: production_company, 
                    as: 'production_company', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: venue, 
                    as: 'venue', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: show, 
                    as: 'show', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: event, 
                    as: 'event', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: review, 
                    as: 'review', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: watchlist, 
                    as: 'watchlist', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                ]
            });
            if (!tag_) {
                throw new Error('Tag not found');
            }

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getTag',
            });

            return {
                ...tag_.dataValues,
                _id: tag_.id
            };
            } catch (err) {
            throw err;
            }
        },
        getTagByQuery: async (_, {args}, { req }) => {
            console.log("Resolver: getTagByQuery...");
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
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'production_company':
                    include.push({ 
                    model: production_company, 
                    as: 'production_company', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'venue':
                    include.push({ 
                    model: venue, 
                    as: 'venue', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'show':
                    include.push({ 
                    model: show, 
                    as: 'show', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'event':
                    include.push({ 
                    model: event, 
                    as: 'event', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'review':
                    include.push({ 
                    model: review, 
                    as: 'review', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                case 'watchlist':
                    include.push({ 
                    model: watchlist, 
                    as: 'watchlist', 
                    foreignKey: 'entity_id',
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

            const tags = await tag.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getTagByQuery',
            });

            return tags.map(tag => {
                return {
                ...tag.dataValues,
                _id: tag.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
    },
    Mutation: {
        createTag: async (_, { tagInput }, { req }) => {
            console.log("Resolver: createTag...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const entityModel = modelMapping[tagInput.entity_type.toLowerCase()];
                const entityExists = await entityModel.findOne({ where: { id: tagInput.entity_id } });
                if (!entityExists) {
                    throw new Error(`Entity: ${tagInput.entity_type} not found`);  
                }

                const tagExists = await tag.findOne({ where: { 
                    entity_id: tagInput.entity_id, 
                    entity_type: tagInput.entity_type, 
                    tag: tagInput.tag 
                }});

                if (tagExists) {
                    throw new Error(`Tag for this ${tagInput.entity_type} already exists`);  
                }

                const tag_ = await tag.create({
                    ...tagInput,
                    create_time: moment().format(),
                    created_by: req.raw.user.id,
                    is_deleted: 'N'
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'createTag',
                });

                return {
                    ...tag_.dataValues,
                    _id: tag_.id
                };

            } catch (err) {
            throw err;
            }
        },
        updateTag: async (_, { id, tagInput }, { req }) => {
            console.log("Resolver: updateTag...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const entityModel = modelMapping[tagInput.entity_type.toLowerCase()];
                const entityExists = await entityModel.findOne({ where: { id: tagInput.entity_id } });
                if (!entityExists) {
                    throw new Error(`Entity: ${tagInput.entity_type} not found`);  
                }

                const access = await canEditExistingEntity(req, {
                    entity_type: 'tag',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

                const tag_ = await tag.findOne({
                    where: { 
                    id: id,
                    is_deleted: 'N'
                    }
                });
                
                await tag_.update({
                    ...tagInput,
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'updateTag',
                });

                return {
                    ...tag_.dataValues,
                    _id: tag_.id
                };
                
            } catch (err) {
            throw err;
            }
        },
        deleteTag: async (_, { id }, { req }) => {
            console.log("Resolver: deleteTag...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const access = canEditExistingEntity(req, {
                entity_type: 'tag',
                entity_id: id,
            })
            if (access.error) {
                throw new Error(access.error);
            }

            const tag_ = await tag.findOne({
                where: { 
                id: id,
                is_deleted: 'N'
                }
            });
            
            await tag_.update({
                is_deleted: 'Y',
                update_time: moment().format(),
                updated_by: req.raw.user.id,
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'deleteTag',
            });

            return {
                ...tag_.dataValues,
                _id: tag_.id
            };
            } catch (err) {
            throw err;
            }
        },
    },
};