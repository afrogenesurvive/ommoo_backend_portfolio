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
const sequelize = require('../../db/models').sequelize;


const { addUserActivity, canEditExistingEntity } = require('../../middleware/utils/utils');

module.exports = {
  Query: {
    getAllWatchlistItems: async (_, { args }, { req }) => {
      console.log("Resolver: getAllWatchlistItems...");
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
            case 'watchlist':
              include.push({ 
                model: watchlist, 
                as: 'watchlist', 
                foreignKey: 'watchlist_id',
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

        const watchlist_items = await watchlist_item.findAll({
          where: where,
          include: include
        });

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'getAllWatchlistItems',
        });

        return watchlist_items.map(watchlist_item => {
          return {
            ...watchlist_item.dataValues,
            _id: watchlist_item.id
          };
        });
      } catch (err) {
        throw err;
      }
    },
    getWatchlistItem: async (_, { id }, { req }) => {
      console.log("Resolver: getWatchlistItemById...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {
        const watchlist_item_ = await watchlist_item.findOne({
          where: { 
            id: id,
            is_deleted: 'N' 
          },
          include: [
            { 
              model: watchlist, 
              as: 'watchlist', 
              foreignKey: 'watchlist_id',
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
              model: file, 
              as: 'files', 
              foreignKey: 'entity_id', 
              where: { is_deleted: 'N' }, 
              required: false 
            },
          ]
        });
        if (!watchlist_item_) {
          throw new Error('Watchlist item not found');
        }

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'getWatchlistItemB',
        });

        return {
          ...watchlist_item_.dataValues,
          _id: watchlist_item_.id
        };
      } catch (err) {
        throw err;
      }
    },
    getWatchlistItemByQuery: async (_, { args }, { req }) => {
      console.log("Resolver: getWatchlistItemByQuery...");
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
            case 'watchlist':
              include.push({ 
                model: watchlist, 
                as: 'watchlist', 
                foreignKey: 'watchlist_id',
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

        const watchlist_items = await watchlist_item.findAll({
          where: where,
          include: include
        });

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'getWatchlistItemByQuery',
        });

        return watchlist_items.map(watchlist_item => {
          return {
            ...watchlist_item.dataValues,
            _id: watchlist_item.id
          };
        });
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    createWatchlistItem: async (_, { watchlistItemInput }, { req }) => {
      console.log("Resolver: createWatchlistItem...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const watchlist_ = await watchlist.findOne({
          where: { 
            id: watchlistItemInput.watchlist_id,
            is_deleted: 'N'
          },
          include: [
            { 
              model: watchlist_item, 
              as: 'watchlist_items', 
              foreignKey: 'watchlist_id',
              where: { is_deleted: 'N' },
              required: false,
            },
          ]
        });
        if (!watchlist_) {
          throw new Error('Watchlist not found');
        }
        if (
          watchlist_.dataValues.created_by !== req.raw.user.id && 
          req.raw.user.role !== 'ADMIN'
        ) {
          throw new Error('Only the creator of the watchlist or an ADMIN can add items to it');
        }

        const watchlist_item_exists = await watchlist_item.findOne({
          where: { 
            show_id: watchlistItemInput.show_id,
            watchlist_id: watchlistItemInput.watchlist_id,
            is_deleted: 'N'
          }
        });
        if (watchlist_item_exists) {
          throw new Error('Show already exists in watchlist');
        }

        const item_count = watchlist_.dataValues.watchlist_items.length || 0;
        watchlistItemInput.position = item_count;
        const watchlist_item_ = await watchlist_item.create({
          ...watchlistItemInput,
          create_time: moment().format(),
          created_by: req.raw.user.id,
          is_deleted: 'N'
        });

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'createWatchlistItem',
        });

        return {
          ...watchlist_item_.dataValues,
          _id: watchlist_item_.id
        };
      } catch (err) {
        throw err;
      }
    },
    updateWatchlistItem: async (_, { id, watchlistItemInput }, { req }) => {
      console.log("Resolver: updateWatchlistItem...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {
        
        const watchlist_ = await watchlist.findOne({
          where: { 
            id: watchlistItemInput.watchlist_id,
            is_deleted: 'N'
          },
          include: [
            { 
              model: watchlist_item, 
              as: 'watchlist_items', 
              foreignKey: 'watchlist_id',
              where: { is_deleted: 'N' },
              required: false,
            },
          ]
        });
        if (!watchlist_) {
          throw new Error('Watchlist not found');
        }
        if (
          watchlist_.dataValues.created_by !== req.raw.user.id && 
          req.raw.user.role !== 'ADMIN'
        ) {
          throw new Error('Only the creator of the watchlist or an ADMIN can add items to it');
        }

        const access = await canEditExistingEntity(req, {
          entity_type: 'watchlist_item',
          entity_id: id,
        })
        // console.log('access', access);
        
        if (access.error) {
            throw new Error(access.error);
        }

        const watchlist_item_ = await watchlist_item.findOne({
          where: { 
            id: id,
            is_deleted: 'N'
          }
        });

        const watchlist_item_exists = await watchlist_item.findOne({
          where: { 
            show_id: watchlistItemInput.show_id,
            watchlist_id: watchlistItemInput.watchlist_id,
            is_deleted: 'N'
          }
        });
        // console.log('watchlist_item_exists', id, watchlist_item_exists.id);
        
        if (watchlist_item_exists && watchlist_item_exists.id !== id) {
          throw new Error('Show already exists in watchlist');
        }

        // position updates
        // update every watchlist_item with a position equal or grater than watchlistItemInput.position by increasing their positions by 1
        if (watchlistItemInput.position !== undefined && watchlistItemInput.position !== watchlist_item_.dataValues.position) {
          if (watchlistItemInput.position > watchlist_item_.dataValues.position) {
            await watchlist_item.update(
              { position: sequelize.literal('position - 1') },
              { where: { watchlist_id: watchlistItem.watchlist_id, position: { [Op.between]: [watchlist_item_.dataValues.position + 1, watchlistItemInput.position] }, is_deleted: 'N' } }
            );
          } else {
            await watchlist_item.update(
              { position: sequelize.literal('position + 1') },
              { where: { watchlist_id: watchlist_item_.dataValues.watchlist_id, position: { [Op.between]: [watchlistItemInput.position, watchlist_item_.dataValues.position - 1] }, is_deleted: 'N' } }
            );
          }
        }

        

        await watchlist_item_.update({
          ...watchlistItemInput,
          update_time: moment().format(),
          updated_by: req.raw.user.id,
        });

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'updateWatchlistItem',
        });

        return {
          ...watchlist_item_.dataValues,
          _id: watchlist_item_.id
        };
      } catch (err) {
        throw err;
      }
    },
    deleteWatchlistItem: async (_, { id, watchlist_id }, { req }) => {
      console.log("Resolver: deleteWatchlistItem...");
      if (!req.raw.isAuth) {
        throw new Error(`Unauthorised: ${req.raw.error_message || ''}`);
      }
      try {

        const watchlist_ = await watchlist.findOne({
          where: { 
            id: watchlist_id,
            is_deleted: 'N'
          },
          include: [
            { 
              model: watchlist_item, 
              as: 'watchlist_items', 
              foreignKey: 'watchlist_id',
              where: { is_deleted: 'N' },
              required: false,
            },
          ]
        });
        if (!watchlist_) {
          throw new Error('Watchlist not found');
        }
        if (
          watchlist_.dataValues.created_by !== req.raw.user.id && 
          req.raw.user.role !== 'ADMIN'
        ) {
          throw new Error('Only the creator of the watchlist or an ADMIN can remove items from it');
        }

        const access = await canEditExistingEntity(req, {
          entity_type: 'watchlist_item',
          entity_id: id,
        })
        // console.log('access', access);
        
        if (access.error) {
            throw new Error(access.error);
        }

        const watchlist_item_ = await watchlist_item.findOne({ where: { id: id, is_deleted: 'N' } });        

        // position updates
        // update every watchlist_item with a position greater than watchlist_item_.dataValues.position by decreasing their positions by 1
        await watchlist_item.update(
          { position: sequelize.literal('position - 1') },
          { where: { watchlist_id: watchlist_item_.dataValues.watchlist_id, position: { [Op.gt]: watchlist_item_.dataValues.position }, is_deleted: 'N' } }
        );

        await watchlist_item_.update({
          is_deleted: 'Y',
          update_time: moment().format(),
          updated_by: req.raw.user.id,
        });

        addUserActivity(req, {
            user_id: req.raw?.user?.id,
            request: 'deleteWatchlistItem',
        });

        return {
          ...watchlist_item_.dataValues,
          _id: watchlist_item_.id
        };
      } catch (err) {
        throw err;
      }
    },
  },
};