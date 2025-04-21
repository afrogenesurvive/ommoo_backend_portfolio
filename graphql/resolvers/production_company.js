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
        getAllProductionCompanies: async (_, {args}, { req }) => {
            console.log("Resolver: getAllProductionCompanies...");
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
                case 'contact':
                    include.push({ 
                    model: contact, 
                    as: 'contacts', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'show':
                    include.push({ 
                    model: show, 
                    as: 'shows', 
                    foreignKey: 'production_company_id',
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
                case 'production_company_user':
                    include.push({ 
                    model: production_company_user, 
                    as: 'production_company_user', 
                    foreignKey: 'production_company_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [{ 
                        model: user, 
                        as: 'user', 
                        foreignKey: 'user_id', 
                        where: { is_deleted: 'N' }, 
                        required: false 
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

            const productionCompanies = await production_company.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getAllProductionCompanies',
            });

            return productionCompanies.map(productionCompany => {
                return {
                ...productionCompany.dataValues,
                _id: productionCompany.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
        getProductionCompany: async (_, { id }, { req }) => {
            console.log("Resolver: getProductionCompanyById...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const productionCompany = await production_company.findOne({
                where: { 
                id: id,
                is_deleted: 'N' 
                },
                include: [
                { 
                    model: contact, 
                    as: 'contacts', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                },
                { 
                    model: show, 
                    as: 'shows', 
                    foreignKey: 'production_company_id',
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
                { 
                    model: production_company_user, 
                    as: 'production_company_user', 
                    foreignKey: 'production_company_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [{ 
                        model: user, 
                        as: 'user', 
                        foreignKey: 'user_id', 
                        where: { is_deleted: 'N' }, 
                        required: false 
                    }]
                },
                ]
            });
            if (!productionCompany) {
                throw new Error('Production Company not found');
            }

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getProductionCompany',
            });

            return {
                ...productionCompany.dataValues,
                _id: productionCompany.id
            };
            } catch (err) {
            throw err;
            }
        },
        getProductionCompanyByQuery: async (_, {args}, { req }) => {
            console.log("Resolver: getProductionCompanyByQuery...");
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
                case 'contact':
                    include.push({ 
                    model: contact, 
                    as: 'contacts', 
                    foreignKey: 'entity_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    });
                    break;
                case 'show':
                    include.push({ 
                    model: show, 
                    as: 'shows', 
                    foreignKey: 'production_company_id',
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
                case 'production_company_user':
                    include.push({ 
                    model: production_company_user, 
                    as: 'production_company_user', 
                    foreignKey: 'production_company_id',
                    where: { is_deleted: 'N' },
                    required: false,
                    include: [{ 
                        model: user, 
                        as: 'user', 
                        foreignKey: 'user_id', 
                        where: { is_deleted: 'N' }, 
                        required: false 
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

            const productionCompanies = await production_company.findAll({
                where: where,
                include: include
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'getProductionCompanyByQuery',
            });

            return productionCompanies.map(productionCompany => {
                return {
                ...productionCompany.dataValues,
                _id: productionCompany.id
                };
            });
            } catch (err) {
            throw err;
            }
        },
    },
    Mutation: {
        createProductionCompany: async (_, { productionCompanyInput }, { req }) => {
            console.log("Resolver: createProductionCompany...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {
            const productionCompany = await production_company.create({
                ...productionCompanyInput,
                create_time: moment().format(),
                created_by: req.raw.user.id,
                is_deleted: 'N'
            });

            addUserActivity(req, {
                user_id: req.raw?.user?.id,
                request: 'createProductionCompany',
            });

            return {
                ...productionCompany.dataValues,
                _id: productionCompany.id
            };
            } catch (err) {
            throw err;
            }
        },
        updateProductionCompany: async (_, { id, productionCompanyInput }, { req }) => {
            console.log("Resolver: updateProductionCompany...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const access = await canEditExistingEntity(req, {
                    entity_type: 'production_company',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }

                const productionCompany = await production_company.findOne({
                    where: { 
                    id: id,
                    is_deleted: 'N'
                    }
                });
                await productionCompany.update({
                    ...productionCompanyInput,
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'updateProductionCompany',
                });

                return {
                    ...productionCompany.dataValues,
                    _id: productionCompany.id
                };
            } catch (err) {
            throw err;
            }
        },
        deleteProductionCompany: async (_, { id }, { req }) => {
            console.log("Resolver: deleteProductionCompany...");
            if (!req.raw.isAuth) {
            throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
            }
            try {

                const access = await canEditExistingEntity(req, {
                    entity_type: 'production_company',
                    entity_id: id,
                })
                // console.log('access', access);
                
                if (access.error) {
                    throw new Error(access.error);
                }
                
                const productionCompany = await production_company.findOne({ where: { id: id } });

                await productionCompany.update({
                    is_deleted: 'Y',
                    update_time: moment().format(),
                    updated_by: req.raw.user.id,
                });

                addUserActivity(req, {
                    user_id: req.raw?.user?.id,
                    request: 'deleteProductionCompany',
                });

                return {
                    ...productionCompany.dataValues,
                    _id: productionCompany.id
                };
            } catch (err) {
            throw err;
            }
        },
    },
};