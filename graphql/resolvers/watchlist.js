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
    getAllWatchlists: async (_, { args }, { req }) => {
      console.log("Resolver: getAllWatchlists...");
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
            case 'watchlist_item':
              include.push({ 
                model: watchlist_item, 
                as: 'watchlist_items', 
                foreignKey: 'watchlist_id',
                where: { is_deleted: 'N' },
                required: false,
                include: [
                  { 
                    model: show, 
                    as: 'show', 
                    foreignKey: 'show_id',
                    where: { is_deleted: 'N' },
                    required: false,
                  },
                ]
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
                required: false,
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

        const watchlists = await watchlist.findAll({
          where: where,
          include: include
        });

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'getAllWatchlists',
        });

        return watchlists.map(watchlist => {
          return {
            ...watchlist.dataValues,
            _id: watchlist.id
          };
        });
      } catch (err) {
        throw err;
      }
    },
    getWatchlist: async (_, { id }, { req }) => {
      console.log("Resolver: getWatchlistById...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {
        const watchlist_ = await watchlist.findOne({
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
              model: watchlist_item, 
              as: 'watchlist_items', 
              foreignKey: 'watchlist_id',
              where: { is_deleted: 'N' },
              required: false,
              include: [
                { 
                  model: show, 
                  as: 'show', 
                  foreignKey: 'show_id',
                  where: { is_deleted: 'N' },
                  required: false,
                },
              ]
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
              required: false,
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
        if (!watchlist_) {
          throw new Error('Watchlist not found');
        }

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'getWatchlist',
        });

        return {
          ...watchlist_.dataValues,
          _id: watchlist_.id
        };
      } catch (err) {
        throw err;
      }
    },
    getWatchlistByQuery: async (_, { args }, { req }) => {
      console.log("Resolver: getWatchlistByQuery...");
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
            case 'watchlist_item':
              include.push({ 
                model: watchlist_item, 
                as: 'watchlist_items', 
                foreignKey: 'watchlist_id',
                where: { is_deleted: 'N' },
                required: false,
                include: [
                  { 
                    model: show, 
                    as: 'show', 
                    foreignKey: 'show_id',
                    where: { is_deleted: 'N' },
                    required: false,
                  },
                ]
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
                required: false,
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

        const watchlists = await watchlist.findAll({
          where: where,
          include: include
        });

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'getWatchlistByQuery',
        });

        return watchlists.map(watchlist => {
          return {
            ...watchlist.dataValues,
            _id: watchlist.id
          };
        });
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    createWatchlist: async (_, { watchlistInput }, { req }) => {
      console.log("Resolver: createWatchlist...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const watchlistExists = await watchlist.findOne({ where: { 
          name: watchlistInput.name, 
        }});

        const watchlist_ = await watchlist.create({
          ...watchlistInput,
          create_time: moment().format(),
          created_by: req.raw.user.id,
          is_deleted: 'N'
        });

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'createWatchlist',
        });

        return {
          ...watchlist_.dataValues,
          _id: watchlist_.id
        };
      } catch (err) {
        throw err;
      }
    },
    updateWatchlist: async (_, { id, watchlistInput }, { req }) => {
      console.log("Resolver: updateWatchlist...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const access = await canEditExistingEntity(req, {
            entity_type: 'watchlist',
            entity_id: id,
        })
        // console.log('access', access);
        
        if (access.error) {
            throw new Error(access.error);
        }
        const watchlist_ = await watchlist.findOne({
          where: { 
            id: id,
            is_deleted: 'N'
          }
        });
        await watchlist_.update({
          ...watchlistInput,
          update_time: moment().format(),
          updated_by: req.raw.user.id,
        });

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'updateWatchlist',
        });

        return {
          ...watchlist_.dataValues,
          _id: watchlist_.id
        };
      } catch (err) {
        throw err;
      }
    },
    deleteWatchlist: async (_, { id }, { req }) => {
      console.log("Resolver: deleteWatchlist...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const access = await canEditExistingEntity(req, {
          entity_type: 'watchlist',
          entity_id: id,
        })
        // console.log('access', access);
        
        if (access.error) {
            throw new Error(access.error);
        }

        const watchlist_ = await watchlist.findOne({ where: { id: id } });
        await watchlist_.update({
          is_deleted: 'Y',
          update_time: moment().format(),
          updated_by: req.raw.user.id,
        });

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'deleteWatchlist',
        });

        return {
          ...watchlist_.dataValues,
          _id: watchlist_.id
        };
      } catch (err) {
        throw err;
      }
    },
  },
};