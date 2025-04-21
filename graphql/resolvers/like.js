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
    getAllLikes: async (_, { args }, { req }) => {
      console.log("Resolver: getAllLikes...");
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

        const likes = await like.findAll({
          where: where,
          include: include
        });

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'getAllLikes',
        });

        return likes.map(like => {
          return {
            ...like.dataValues,
            _id: like.id
          };
        });
      } catch (err) {
        throw err;
      }
    },
    getLike: async (_, { id }, { req }) => {
      console.log("Resolver: getLikeById...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {
        const like_ = await like.findOne({
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
        if (!like_) {
          throw new Error('Like not found');
        }

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'getLike',
        });

        return {
          ...like_.dataValues,
          _id: like_.id
        };
      } catch (err) {
        throw err;
      }
    },
    getLikeByQuery: async (_, { args }, { req }) => {
      console.log("Resolver: getLikeByQuery...");
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

        const likes = await like.findAll({
          where: where,
          include: include
        });

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'getLikeByQuery',
        });

        return likes.map(like => {
          return {
            ...like.dataValues,
            _id: like.id
          };
        });
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    createLike: async (_, { likeInput }, { req }) => {
      console.log("Resolver: createLike...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const entityModel = modelMapping[likeInput.entity_type.toLowerCase()];
        const entityExists = await entityModel.findOne({ where: { id: likeInput.entity_id } });
        if (!entityExists) {
          throw new Error(`Entity: ${likeInput.entity_type} not found`);  
        }

        const likeForUserExists = await like.findOne({ where: { 
          entity_id: likeInput.entity_id, 
          entity_type: likeInput.entity_type,
          created_by: req.raw.user.id,
      }});

      if (likeForUserExists) {
          throw new Error(`like for this ${likeInput.entity_type} & User already exists`);  
      }

        const like_ = await like.create({
          ...likeInput,
          create_time: moment().format(),
          created_by: req.raw.user.id,
          is_deleted: 'N'
        });

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'createLike',
        });

        return {
          ...like_.dataValues,
          _id: like_.id
        };
      } catch (err) {
        throw err;
      }
    },
    updateLike: async (_, { id, likeInput }, { req }) => {
      console.log("Resolver: updateLike...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const entityModel = modelMapping[likeInput.entity_type.toLowerCase()];
        const entityExists = await entityModel.findOne({ where: { id: likeInput.entity_id } });
        if (!entityExists) {
          throw new Error(`Entity: ${likeInput.entity_type} not found`);  
        }

        const access = await canEditExistingEntity(req, {
            entity_type: 'like',
            entity_id: id,
        })
        // console.log('access', access);
        
        if (access.error) {
            throw new Error(access.error);
        }
        
        const like_ = await like.findOne({
          where: { 
            id: id,
            is_deleted: 'N'
          }
        });

        await like_.update({
          ...likeInput,
          update_time: moment().format(),
          updated_by: req.raw.user.id,
        });

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'updateLike',
        });

        return {
          ...like_.dataValues,
          _id: like_.id
        };
      } catch (err) {
        throw err;
      }
    },
    deleteLike: async (_, { id }, { req }) => {
      console.log("Resolver: deleteLike...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const access = await canEditExistingEntity(req, {
            entity_type: 'like',
            entity_id: id,
        })
        // console.log('access', access);
        
        if (access.error) {
            throw new Error(access.error);
        }

        const like_ = await like.findOne({ where: { id: id } });
        await like_.update({
          is_deleted: 'Y',
          update_time: moment().format(),
          updated_by: req.raw.user.id,
        });

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'deleteLike',
        });

        return {
          ...like_.dataValues,
          _id: like_.id
        };
      } catch (err) {
        throw err;
      }
    },
  },
};