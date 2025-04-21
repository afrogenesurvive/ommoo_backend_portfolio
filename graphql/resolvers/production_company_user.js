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
        getAllProductionCompanyUsers: async (_, {args}, { req }) => {
            console.log("Resolver: getAllProductionCompanyUsers...");
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
                case 'production_company':
                    include.push({ 
                    model: production_company, 
                    as: 'production_company', 
                    foreignKey: 'production_company_id',
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

            const productionCompanyUsers = await production_company_user.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getAllProductionCompanyUsers',
            });

            return productionCompanyUsers.map(productionCompanyUser => {
                return {
                ...productionCompanyUser.dataValues,
                _id: productionCompanyUser.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
        getProductionCompanyUser: async (_, { id }, { req }) => {
            console.log("Resolver: getProductionCompanyUserById...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const productionCompanyUser = await production_company_user.findOne({
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
                    model: production_company, 
                    as: 'production_company', 
                    foreignKey: 'production_company_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                ]
            });

            if (!productionCompanyUser) {
                throw new Error('Production Company User not found');
            }

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getProductionCompanyUser',
            });

            return {
                ...productionCompanyUser.dataValues,
                _id: productionCompanyUser.id
            };
            } catch (err) {
            throw err;
            }
        },
        getProductionCompanyUserByQuery: async (_, {args}, { req }) => {
            console.log("Resolver: getProductionCompanyUserByQuery...");
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
                case 'production_company':
                    include.push({ 
                    model: production_company, 
                    as: 'production_company', 
                    foreignKey: 'production_company_id',
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

            const productionCompanyUsers = await production_company_user.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getProductionCompanyUserByQuery',
            });

            return productionCompanyUsers.map(productionCompanyUser => {
                return {
                ...productionCompanyUser.dataValues,
                _id: productionCompanyUser.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
    },
    Mutation: {
        createProductionCompanyUser: async (_, { productionCompanyUserInput }, { req }) => {
            console.log("Resolver: createProductionCompanyUser...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const userExists = await user.findOne({ where: { id: productionCompanyUserInput.user_id } });

                const productionCompanyExists = await production_company.findOne({ where: { id: productionCompanyUserInput.production_company_id } });

                if (
                    !userExists || 
                    !productionCompanyExists
                ) {
                    throw new Error('User or Production Company not found');
                }

                const productionCompanyUser = await production_company_user.create({
                    ...productionCompanyUserInput,
                    create_time: moment().format(),
                    created_by: req.raw.user.id,
                    is_deleted: 'N'
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'createProductionCompanyUser',
                });

            return {
                ...productionCompanyUser.dataValues,
                _id: productionCompanyUser.id
            };

            } 
                catch (err) 
            {
                throw err;
            }
        },
        updateProductionCompanyUser: async (_, { id, productionCompanyUserInput }, { req }) => {
            console.log("Resolver: updateProductionCompanyUser...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const productionCompanyUser = await production_company_user.findOne({
                    where: { 
                    id: id,
                    is_deleted: 'N'
                    }
                });

                if (!productionCompanyUser) {
                    throw new Error('Production Company User not found');
                }

                const userExists = await user.findOne({ where: { id: productionCompanyUserInput.user_id } });

                const productionCompanyExists = await production_company.findOne({ where: { id: productionCompanyUserInput.production_company_id } });

                if (
                    !userExists || 
                    !productionCompanyExists
                ) {
                    throw new Error('User or Production Company not found');
                }

                const access = await canEditExistingEntity(req, {
                    entity_type: 'production_company_user',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

                await productionCompanyUser.update({
                    ...productionCompanyUserInput,
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'updateProductionCompanyUser',
                });

                return {
                    ...productionCompanyUser.dataValues,
                    _id: productionCompanyUser.id
                };
            } catch (err) {
            throw err;
            }
        },
        deleteProductionCompanyUser: async (_, { id }, { req }) => {
            console.log("Resolver: deleteProductionCompanyUser...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const access = await canEditExistingEntity(req, {
                    entity_type: 'production_company_user',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

                const productionCompanyUser = await production_company_user.findOne({ where: { id: id } });
                

                await productionCompanyUser.update({
                    is_deleted: 'Y',
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'deleteProductionCompanyUser',
                });

                return {
                    ...productionCompanyUser.dataValues,
                    _id: productionCompanyUser.id
                };
                
            } catch (err) {
            throw err;
            }
        },
    },
};